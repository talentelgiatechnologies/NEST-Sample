// tasks.service.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BOOKINGS, EXPERIENCE_BOOKING, EXPERIENCE_PAYOUT, INBOX, MESSAGE, PAYMENT_HISTORY, PAYOUT } from 'database/constants';
import { Booking, BookingRemainderEnum, BookingStatus } from 'database/enitity/Booking.entity';
import { ExperienceBookingEntity, ExperienceBookingStatus } from 'database/enitity/ExperienceBooking.entity';
import { PaymentStatus } from 'database/enitity/ExperiencePaymentHistory.entity';
import { ExperiencePayoutEntity } from 'database/enitity/ExperiencePayout.entity';
import { YesNo } from 'database/enitity/host/HostTax.entity';
import { Inbox } from 'database/enitity/Inbox.entity';
import { Message, MessageTypeEnum } from 'database/enitity/Message.entity';
import { PaymentHistory } from 'database/enitity/PaymentHistory.entity';
import { Payout, PayoutStatus } from 'database/enitity/Payout.entity';
import { PayoutType } from 'database/enitity/PayoutAccount.entity';
import { calculateBreakup } from 'lib/calculateBreakup';
import { CommonCurrencyService } from 'lib/common/currency/common.currency.service';
import { config } from 'lib/config';
import { getPayoutDate } from 'lib/getPayoutDate';
import { payoutTypes } from 'lib/payouts';
import Stripe from 'stripe';
import { In, IsNull, LessThanOrEqual, MoreThan, Repository, SelectQueryBuilder } from 'typeorm';

interface WompiPayoutPayload {
    reference: string;
    accountId: string;
    paymentType: "PROVIDERS" | "PAYROLL" | "OTHER";
    transactions: Array<{
        legalIdType: string;
        legalId: string;
        bankId: string;
        accountType: "AHORROS" | "CORRIENTE";
        accountNumber: string;
        name: string;
        amount: number;
        personType: "NATURAL" | "JURIDICA";
        description: string;
        phone: string;
        email: string;
        reference: string;
    }>;
}


@Injectable()
export class TasksService {
    stripe: Stripe;

    constructor(
        @Inject(BOOKINGS)
        private bookingRepository: Repository<Booking>,
        @Inject(EXPERIENCE_BOOKING)
        private experienceBookingRepository: Repository<ExperienceBookingEntity>,
        @Inject(MESSAGE)
        private messageRepository: Repository<Message>,
        @Inject(INBOX)
        private inboxRepository: Repository<Inbox>,
        @Inject(PAYMENT_HISTORY)
        private paymentHistoryRepository: Repository<PaymentHistory>,
        @Inject(PAYOUT)
        private payoutRepository: Repository<Payout>,
        @Inject(EXPERIENCE_PAYOUT)
        private experiencePayoutRepository: Repository<ExperiencePayoutEntity>,
        private readonly currencyService: CommonCurrencyService,
    ) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    private readonly logger = new Logger(TasksService.name);

    async completeCron() {
        const bookings = await this.bookingRepository.find({
            where: {
                bookingStatus: BookingStatus.APPROVED,
                endDate: LessThanOrEqual((new Date()))
            },
            relations: {
                property: true
            }
        })


        // email trigger for review and complete booking
        this.logger.debug(`Found ${bookings.length} bookings to complete.`);

        if (bookings.length > 0) {
            await this.bookingRepository.update({
                id: In(bookings.map(item => item.id))
            }, {
                bookingStatus: BookingStatus.COMPLETED
            })

            const payouts = bookings.map(booking => {
                return {
                    payout: booking.total - booking.serviceFee - booking.hostServiceFee,
                    serviceFee: booking.hostServiceFee,
                    bookingId: booking.id,
                    currency: booking.currency
                }
            })

            this.payoutRepository.save(payouts)

            const oldMessages = await this.messageRepository.createQueryBuilder('message')
                .where('message.bookingId IN (:bookingIds)', { bookingIds: bookings.map(item => item.id).toString() })
                .andWhere('message.messageType = :messageType', { messageType: MessageTypeEnum.APPROVED })
                .groupBy('message.bookingId')
                .addGroupBy('message.senderId')
                .addGroupBy('message.inboxId')
                .addGroupBy('message.id')
                .select([
                    'message.senderId',
                    'message.bookingId',
                    'message.inboxId'
                ])
                .getMany();

            console.log(oldMessages);

            const messages = oldMessages.map(oldMessage => {
                return {
                    senderId: oldMessage.senderId,
                    bookingId: oldMessage.bookingId,
                    inboxId: oldMessage.inboxId,
                    messageType: MessageTypeEnum.COMPLETED
                }
            })

            await this.messageRepository.save(messages)

        }
    }

    async preApproveExpiryCron(subQuery: SelectQueryBuilder<Message>) {
        const preApproveRequests = await this.messageRepository
            .createQueryBuilder('message')
            .innerJoin(
                '(' + subQuery.getQuery() + ')',
                'latest',
                'message.createdAt = latest.maxCreatedAt AND message.inboxId = latest.inboxId'
            )
            .setParameters(subQuery.getParameters()) // this is important!
            .select([
                'message.id',
                'message.inboxId',
                'message.messageType',
                'message.createdAt',
                'message.senderId',
                'message.propertyId',
                'message.guests',
                'message.startDate',
                'message.endDate',
                'message.bookingId',
            ])
            .where('message.messageType = :type', { type: MessageTypeEnum.ENQUIRY })
            .andWhere('message.createdAt <= :expiryDate', { expiryDate: new Date(Date.now() - 24 * 60 * 60 * 1000) }) // 24 hours ago
            .orderBy('message.createdAt', 'DESC')
            .getMany();
        this.logger.debug(`Found ${preApproveRequests.length} pre-approve requests.`);

        const preApproveExpiryArray = preApproveRequests.map(request => {
            return {
                inboxId: request.inboxId,
                senderId: request.senderId,
                messageType: MessageTypeEnum.ENQUIRY_EXPIRED,
                propertyId: request.propertyId,
                guests: request.guests,
                startDate: request.startDate,
                endDate: request.endDate,
            }
        })

        // expiry email trigger for pre approve request

        await this.messageRepository.save(preApproveExpiryArray);

    }

    async bookingExpiryCron(subQuery: SelectQueryBuilder<Message>) {
        const bookingRequests = await this.messageRepository
            .createQueryBuilder('message')
            .innerJoin(
                '(' + subQuery.getQuery() + ')',
                'latest',
                'message.createdAt = latest.maxCreatedAt AND message.inboxId = latest.inboxId'
            )
            .setParameters(subQuery.getParameters()) // this is important!
            .select([
                'message.id',
                'message.inboxId',
                'message.messageType',
                'message.createdAt',
                'message.senderId',
                'message.propertyId',
                'message.guests',
                'message.startDate',
                'message.endDate',
                'message.bookingId',
            ])
            .where('message.messageType = :type', { type: MessageTypeEnum.REQUESTED })
            .andWhere('message.createdAt <= :expiryDate', { expiryDate: new Date(Date.now() - 24 * 60 * 60 * 1000) }) // 24 hours ago
            .orderBy('message.createdAt', 'DESC')
            .getMany();
        this.logger.debug(`Found ${bookingRequests.length} booking requests.`);

        const bookingRequestsExpiryArray = bookingRequests.map(request => {
            return {
                inboxId: request.inboxId,
                senderId: request.senderId,
                messageType: MessageTypeEnum.EXPIRED,
                propertyId: request.propertyId,
                guests: request.guests,
                startDate: request.startDate,
                endDate: request.endDate,
                bookingId: request.bookingId
            }
        })

        // expiry email trigger for pre approve request

        await this.messageRepository.save(bookingRequestsExpiryArray);

        if (bookingRequests.length > 0) {
            await this.bookingRepository.update({
                id: In(bookingRequests.map(item => item.bookingId))
            }, {
                bookingStatus: BookingStatus.EXPIRED
            })
        }

    }

    async autoPayoutCron() {
        const pendingPayouts = await this.payoutRepository.find({
            where: {
                payoutStatus: PayoutStatus.PENDING
            },
            relations: {
                booking: {
                    property: {
                        user: {
                            payouts: {
                                details: true
                            }
                        }
                    }
                },

            }
        })

        this.logger.debug(`Found ${pendingPayouts.length} pending payouts.`);

        await Promise.all(pendingPayouts.map(async (payout) => {
            const method = payout.booking.property.user.payouts.find(item => item.defaultPayout)
            console.log(method);


            if (method) {
                if (method.payoutType == PayoutType.STRIPE) {
                    const transfer = await this.stripe.transfers.create({
                        amount: payout.payout * 100, // amount in cents (i.e. ₹10 would be 1000 paisa)
                        currency: payoutTypes[1].currency, // or "usd", etc.
                        destination: method.details.accountId, // Connected Account ID
                        description: "Payout for services rendered"
                    });

                    console.log(transfer);

                    await this.payoutRepository.update({
                        id: payout.id
                    }, {
                        payoutStatus: PayoutStatus.COMPLETED,
                        payoutAccountId: method.id
                    })

                }
            }
        }))
    }

    async bookingRemainderCron() {
        const remainderBookings = await this.bookingRepository.find({
            where: {
                bookingRemainder: BookingRemainderEnum.NOT_SENT,
                bookingStatus: In([BookingStatus.APPROVED]),
                startDate: MoreThan(new Date())
            },
            take: 10
        })


        if (remainderBookings.length > 0) {
            // email 

            await this.bookingRepository.update({
                id: In(remainderBookings.map(item => item.id))
            }, {
                bookingRemainder: BookingRemainderEnum.SENT
            })
        }
    }

    dateToFloat(date: Date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return hours + (minutes / 60);
    }

    async experienceBookingCompleteCron() {
        // get all experience booking which are approved and end date is less than today
        // update status to completed
        // trigger email for review and complete booking



        const bookings = await this.experienceBookingRepository.find({
            where: {
                bookingStatus: ExperienceBookingStatus.APPROVED,
                date: LessThanOrEqual((new Date())),
                endTime: LessThanOrEqual(this.dateToFloat(new Date())),
                payment: {
                    paymentStatus: PaymentStatus.PAYMENT_COMPLETED
                }
            },
            relations: {
                experience: {
                    step2: true,
                    
                },
                user: {
                    profile: true
                },
                payment: true,
            },
            take: 10
        })

        this.logger.debug(`Found ${bookings.length} experience bookings to complete.`);

        await this.experienceBookingRepository.update({
            id: In(bookings.map(item => item.id))
        }, {
            bookingStatus: ExperienceBookingStatus.COMPLETED
        })




        const payouts = bookings.map(booking => {
            const { host: { finalPayoout } } = calculateBreakup(booking.avgBasePrice, booking.guests, booking.vatResponsible == YesNo.YES, booking.serviceFee, booking.hostServiceFee)
            return {
                payout: finalPayoout,
                // serviceFee: booking.hostServiceFee,
                bookingId: booking.id,
                currency: booking.currency,
                expectedDate: getPayoutDate()
            }
        })

        const payout = this.experiencePayoutRepository.create(payouts)

        await this.experiencePayoutRepository.save(payout)

        bookings.forEach(async (booking) => {

            await fetch(`${config().CORE_URL}/mailer/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: booking.user.email,
                    subject: "Your experience is completed",
                    templateName: 'experience-completed',
                    context: {
                        guestName: booking.user.profile.firstName,
                        experienceTitle: booking.experience.step2.title,
                        reviewLink: `${config().SITE_HOST}/user/review/${booking.id}`,
                        currentYear: new Date().getFullYear(),
                        siteName: 'Momenta Boutique'
                    }
                })
            });
        })

          // Email triggers for both guest and host
    for (const booking of bookings) {
        const reviewLink = `${config().SITE_HOST}/user/review/${booking.id}`;
        const hostReviewLink = `${config().SITE_HOST}/host/review/${booking.id}`;

        // Send mail to GUEST — review their experience
        await fetch(`${config().CORE_URL}/mailer/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: booking.user.email,
                subject: "We’d love your feedback!",
                templateName: 'reviewRequest', //  this template for guest
                context: {
                    guestName: booking.user.profile.firstName,
                    listingTitle: booking.experience.step2.title,
                    reviewUrl: reviewLink,
                    siteName: 'Momenta Boutique',
                    currentYear: new Date().getFullYear(),
                }
            })
        });

        // 2 Send mail to HOST — review their guest
        await fetch(`${config().CORE_URL}/mailer/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: booking.experience.user.email,
                subject: `Review your guest ${booking.user.profile.firstName}`,
                templateName: 'hostReviewGuest', // this template for host
                context: {
                    hostName: booking.experience.user.profile.firstName,
                    guestName: booking.user.profile.firstName,
                    listingTitle: booking.experience.step2.title,
                    bookingSlot: booking.date, 
                    reviewUrl: hostReviewLink,
                    siteName: 'Momenta Boutique',
                    currentYear: new Date().getFullYear(),
                }
            })
        });
    }


    }

    async experienceAutoPayoutCron() {
        const payouts = await this.experiencePayoutRepository.find({
            where: {
                payoutStatus: PayoutStatus.PENDING,
                documentApproved: YesNo.YES,
                // createdAt: LessThanOrEqual(new Date(Date.now() - 24 * 60 * 60 * 1000 * 3)),
                expectedDate: LessThanOrEqual(new Date())
            },
            relations: {
                booking: {
                    experience: {
                        user: {
                            host: {
                                bank: true,
                            },
                            profile: true,
                        }
                    }
                }

            }
        })

        this.logger.debug(`Found ${payouts.length} experience payouts to complete.`);

        let payoutPayloads: WompiPayoutPayload = {
            reference: `EXP_PAYOUT_${Date.now()}`,
            accountId: `WOMPI_ACCOUNT`,
            paymentType: "PAYROLL",
            transactions: []
        };

        payouts.forEach(payout => {
            const hostBank = payout.booking.experience.user.host.bank;
            if (hostBank) {
                payoutPayloads.transactions.push({
                    legalIdType: hostBank.idDocumentType,
                    legalId: hostBank.idDocumentNumber,
                    bankId: `6e422ee9-6863-4882-a265-42258b410caa`,
                    accountType: "AHORROS",
                    accountNumber: hostBank.accountNumber,
                    name: `${payout.booking.experience.user.profile.firstName} ${payout.booking.experience.user.profile.lastName}`,
                    amount: Math.round(payout.payout * 100), // in cents
                    personType: "NATURAL",
                    description: `Payout for experience booking ID ${payout.booking.id}`,
                    phone: payout.booking.experience.user.phoneNumber || '0000000000',
                    email: payout.booking.experience.user.email,
                    reference: `${payout.id}`
                })
            }
        })

        payoutPayloads.transactions.map(async (txn) => {
            const res = await fetch(config().WOMPI_PAYOUT_URL + "/payouts", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'user-principal-id': config().WOMPI_USER_PRINCIPAL_ID_SANDBOX,
                    'x-api-key': config().WOMPI_X_API_KEY_SANDBOX
                },
                body: JSON.stringify({
                    ...payoutPayloads,
                    transactions: [txn]
                })
            });

            const data = await res.json() as {
                status: number; message: string, code: string, meta: { trace_id: string }, data: { payoutId: string }
            };

            console.log(data);


            if (data.status == 200) {
                await this.experiencePayoutRepository.update({
                    id: txn.reference
                }, {
                    payoutStatus: PayoutStatus.COMPLETED,
                    wompiId: data.data.payoutId,
                    wompiCode: data.code,
                    failureReason: null
                })
            }else {
                await this.experiencePayoutRepository.update({
                    id: txn.reference
                }, {
                    payoutStatus: PayoutStatus.FAILED,
                    wompiCode: data.code,
                    failureReason: data.message
                })
            }
        })

        // if (payouts.length > 0) {



        //     await this.experiencePayoutRepository.update({
        //         id: In(payouts.map(item => item.id))
        //     }, {
        //         payoutStatus: PayoutStatus.COMPLETED
        //     })


        // }
    }

    async checkPayoutDocumentApproval() {
        // get all experience payout with document approved as null and if it has passed expected date then update failure reason

        const payouts = await this.experiencePayoutRepository.find({
            where: {
                documentName: IsNull(),
                expectedDate: LessThanOrEqual(new Date()),
                failureReason: IsNull()
            }
        })

        this.logger.debug(`Found ${payouts.length} experience payouts to check document approval.`);

        if (payouts.length > 0) {
            await this.experiencePayoutRepository.update({
                id: In(payouts.map(item => item.id))
            }, {
                // documentApproved: YesNo.NO,
                // payoutStatus: PayoutStatus.FAILED,
                failureReason: 'No document was uploaded by the Host'
            })
        }

    }



    // Runs every minute
    @Cron(CronExpression.EVERY_10_MINUTES)
    async handleCron() {
        try {
            this.logger.debug('Cron job running every 5 minute...');

            await this.completeCron()

            await this.experienceBookingCompleteCron()

            const subQuery = this.messageRepository
                .createQueryBuilder('subMessage')
                .select('MAX(subMessage.createdAt)', 'maxCreatedAt')
                .addSelect('subMessage.inboxId', 'inboxId')
                .andWhere('subMessage.messageType != :excludedType', { excludedType: MessageTypeEnum.MESSAGE })
                .groupBy('subMessage.inboxId');

            await this.preApproveExpiryCron(subQuery);
            await this.bookingExpiryCron(subQuery)
            await this.autoPayoutCron()
            await this.bookingRemainderCron()
            await this.experienceAutoPayoutCron()
            await this.checkPayoutDocumentApproval()
        } catch (error) {
            console.log(error);

        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async currencyCron() {
        try {
            this.logger.debug('Cron job running every mid night...');

            this.logger.debug('Currency cron started...');

            await this.currencyService.populateCurrencyRateData()

            this.logger.debug('Currency cron finished...');
        } catch (error) {
            console.log(error);
        }


    }

    // todo expired experience


}
