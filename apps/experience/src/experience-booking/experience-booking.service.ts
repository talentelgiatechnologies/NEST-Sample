import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { COUPON_CODE_USAGE, CREDITS, EXPERIENCE_BOOKING, EXPERIENCE_BOOKING_HOST_PROPOSAL, EXPERIENCE_BULK_DATES, EXPERIENCE_BULK_DATES_SLOTS_ENTITY, EXPERIENCE_CANCELLATION, EXPERIENCE_LISTING, EXPERIENCE_OLD_BOOKING, EXPERIENCE_PAYMENT_HISTORY, EXPERIENCE_PAYOUT, EXPERIENCE_REFUND, EXPERIENCE_SLOT_BOOKINGS, EXPERIENCE_SPECIFIC_DATES, EXPERIENCE_SPECIFIC_DATES_SLOTS_ENTITY, INBOX, MESSAGE } from 'database/constants';
import { In, MoreThan, Repository } from 'typeorm';
import { ExperienceListingEntity } from 'database/enitity/Experience.entity';
import { ExperienceBookingTypeEnum } from 'database/enitity/ExperienceDaySlots.entity';
import { ExperienceAvailabilityType } from 'database/enitity/ExperienceListingStep5.entity';
import { ExperienceBookingEntity, ExperienceBookingStatus, ExperienceType } from 'database/enitity/ExperienceBooking.entity';
import { ExperiencePaymentHistoryEntity, PaymentStatus } from 'database/enitity/ExperiencePaymentHistory.entity';
import { ExperienceBookingDto, PayoutUpdatedEvent, TransactionUpdatedEvent } from './dto/create-experience-booking.dto';
import { Inbox } from 'database/enitity/Inbox.entity';
import { Message, MessageTypeEnum } from 'database/enitity/Message.entity';
import { ExperienceOldBookingEntity } from 'database/enitity/ExperienceOldBooking.entity';
import { ExperienceBookingHostProposalEntity } from 'database/enitity/ExperienceBookingHostProposal.entity';
import { differenceInCalendarDays, isBefore, isSameDay } from 'date-fns';
import { ExperienceBulkDateSlotsEntity } from 'database/enitity/ExperienceBulkDateSlots.entity';
import { ExperienceSpecificDateSlotsEntity, SlotAvailability } from 'database/enitity/ExperienceSpecificDatesSlots.entity';
import { ExperienceDayOpenEnum, ExperienceSpecificDatesEntity, ExperienceWholeDayEnum } from 'database/enitity/ExperienceSpecificDates.entity';
import { ExperienceBulkDatesEntity } from 'database/enitity/ExperienceBulkDates.entity';
import fetch from 'node-fetch';
import { config } from 'lib/config';
import { calculateBreakup } from 'lib/calculateBreakup';
import { YesNo } from 'database/enitity/host/HostTax.entity';
import { ExperienceRefundEntity } from 'database/enitity/ExperienceRefund.entity';
import { ExperiencePayoutEntity } from 'database/enitity/ExperiencePayout.entity';
import { ExperienceCancellationEntity } from 'database/enitity/ExperienceCancellation.entity';
import { COUPON_CODE_TYPE_ENUM, CouponCode } from 'database/enitity/CouponCode.entity';
import { CouponCodeUsage } from 'database/enitity/CouponCodeUsage.entity';
import { Credits, CreditStatus } from 'database/enitity/Credits.entity';
import { ExperienceSlotBookingsEntity } from 'database/enitity/ExperienceSlotBookings.entity';
import { Parser } from 'json2csv';
import { Response } from 'express';
import { format } from 'date-fns';



@Injectable()
export class ExperienceBookingService {
    constructor(
        @Inject(EXPERIENCE_LISTING) private readonly experienceListingRepo: Repository<ExperienceListingEntity>,
        @Inject(EXPERIENCE_BOOKING) private readonly experienceBookingRepo: Repository<ExperienceBookingEntity>,
        @Inject(EXPERIENCE_PAYMENT_HISTORY) private readonly experiencePaymentHistoryRepo: Repository<ExperiencePaymentHistoryEntity>,
        @Inject(INBOX) private readonly inboxRepo: Repository<Inbox>,
        @Inject(EXPERIENCE_OLD_BOOKING) private readonly oldBookingRepo: Repository<ExperienceOldBookingEntity>,
        @Inject(EXPERIENCE_BOOKING_HOST_PROPOSAL) private readonly hostProposalRepo: Repository<ExperienceBookingHostProposalEntity>,
        @Inject(MESSAGE) private readonly messageRepo: Repository<Message>,
        @Inject(EXPERIENCE_BULK_DATES) private readonly experienceBulkDatesRepo: Repository<ExperienceBulkDatesEntity>,
        @Inject(EXPERIENCE_SPECIFIC_DATES) private readonly experienceSpecificDatesRepo: Repository<ExperienceSpecificDatesEntity>,
        @Inject(EXPERIENCE_BULK_DATES_SLOTS_ENTITY) private readonly experienceBulkDatesSlotsRepo: Repository<ExperienceBulkDateSlotsEntity>,
        @Inject(EXPERIENCE_SPECIFIC_DATES_SLOTS_ENTITY) private readonly experienceSpecificDatesSlotsRepo: Repository<ExperienceSpecificDateSlotsEntity>,
        @Inject(EXPERIENCE_REFUND) private readonly experienceRefundRepo: Repository<ExperienceRefundEntity>,
        @Inject(EXPERIENCE_PAYOUT) private readonly experiencePayoutRepo: Repository<ExperiencePayoutEntity>,
        @Inject(EXPERIENCE_CANCELLATION) private readonly experienceCancellationRepo: Repository<ExperienceCancellationEntity>,
        @Inject(COUPON_CODE_USAGE) private readonly couponCodeUsageRepo: Repository<CouponCodeUsage>,
        @Inject(CREDITS) private readonly creditsRepo: Repository<Credits>,
        @Inject(EXPERIENCE_SLOT_BOOKINGS) private readonly experienceSlotBookingsRepo: Repository<ExperienceSlotBookingsEntity>,

    ) { }

    async blockSlot(experienceId: string, selectedDate: Date, isPrivate: boolean, from: number, to: number, guests: number, bookingType: ExperienceBookingTypeEnum, bookingId: string) {
        const experience = await this.experienceListingRepo.findOne({
            relations: {
                experienceSpecificDates: {
                    experienceSpecificDatesSlots: true
                },
                experienceBulkDates: {
                    experienceBulkSlots: true
                },
                step5: true
            },
            where: {
                id: experienceId,
            }
        })

        if (!experience) {
            throw new BadRequestException("Invalid experience")
        }

        const day = selectedDate ? (selectedDate.getDay()) : undefined;

        const homeBulkTimings = (day !== undefined) ? experience.experienceBulkDates.find(days => {
            return (days.day == day) && days.experienceType == ExperienceType.PRIVATE
        }) : undefined;

        const siteBulkTimings = (day !== undefined) ? experience.experienceBulkDates.find(days => {
            return (days.day == day) && days.experienceType == ExperienceType.PUBLIC
        }) : undefined;

        const homeSpecificTimings = (selectedDate) ? experience.experienceSpecificDates.find(days => {
            return (isSameDay(days.date, selectedDate)) && days.experienceType == ExperienceType.PRIVATE
        }) : undefined;

        const siteSpecificTimings = (selectedDate) ? experience.experienceSpecificDates.find(days => {
            return (isSameDay(days.date, selectedDate)) && days.experienceType == ExperienceType.PUBLIC
        }) : undefined;

        if (isPrivate) {
            if (experience.step5.availabilityType == ExperienceAvailabilityType.STORE) throw new BadRequestException("Private session unavailable")
            if ((homeSpecificTimings?.experienceDayOpen == ExperienceDayOpenEnum.CLOSED && homeBulkTimings?.experienceDayOpen == ExperienceDayOpenEnum.CLOSED)) {
                throw new BadRequestException("Private session unavaclosedilable")
            }
        } else {
            if (experience.step5.availabilityType == ExperienceAvailabilityType.HOME) throw new BadRequestException("Public session unavailable")
            if ((siteBulkTimings?.experienceDayOpen == ExperienceDayOpenEnum.CLOSED && siteSpecificTimings?.experienceDayOpen == ExperienceDayOpenEnum.CLOSED)) {
                throw new BadRequestException("Public session closed")
            }
        }

        const privateSlots = (homeSpecificTimings?.experienceSpecificDatesSlots || []).filter(slot => slot.experienceBookingType == bookingType && (slot.slotAvailablity == SlotAvailability.OPEN || slot.slotAvailablity == null) && slot.minSeat <= guests && slot.maxSeat >= guests)
        const privateBulkSlots = (homeBulkTimings?.experienceBulkSlots || []).filter(slot => slot.experienceBookingType == bookingType && slot.minSeat <= guests && slot.maxSeat >= guests)
        const publicSlots = (siteSpecificTimings?.experienceSpecificDatesSlots || []).filter(slot => slot.experienceBookingType == bookingType && (slot.slotAvailablity == SlotAvailability.OPEN || slot.slotAvailablity == null) && slot.minSeat <= guests && slot.maxSeat >= guests)
        const publicBulkSlots = (siteBulkTimings?.experienceBulkSlots || []).filter(slot => slot.experienceBookingType == bookingType && slot.minSeat <= guests && slot.maxSeat >= guests)


        let slot: ExperienceBulkDateSlotsEntity | ExperienceSpecificDateSlotsEntity, specialPrice: number, slotType: number = 2;
        if (isPrivate) {
            slot = privateSlots.find(slot => slot.fhour == from && slot.thour == to)
            if (!slot) {
                slot = privateBulkSlots.find(slot => slot.fhour == from && slot.thour == to)
                slotType = 1;
            }
            specialPrice = slot?.specialPrice;
        } else {
            slot = publicSlots.find(slot => slot.fhour == from && slot.thour == to)
            if (!slot) {
                slot = publicBulkSlots.find(slot => slot.fhour == from && slot.thour == to)
                slotType = 1;
            }
            specialPrice = slot?.specialPrice;
        }

        if (!slot) {
            throw new BadRequestException("Slot is not available please choose different one")
        }


        if (slotType == 2) {
            const existing = experience.experienceSpecificDates.find(item => isSameDay(selectedDate, new Date(item.date)) && item.experienceType == (isPrivate ? ExperienceType.PRIVATE : ExperienceType.PUBLIC))

            if (existing) {
                const slotExist = existing.experienceSpecificDatesSlots.find(item => item.fhour == from && item.thour == to)
                if (slotExist) {
                    await this.experienceSpecificDatesSlotsRepo.update({
                        id: slotExist.id
                    }, {
                        slotAvailablity: SlotAvailability.BOOKED,
                        // experienceBookingId: bookingId
                    })

                    const newBookingSlot = new ExperienceSlotBookingsEntity();
                    newBookingSlot.experienceBookingId = Number(bookingId);
                    newBookingSlot.specificSlotId = slotExist.id;
                    newBookingSlot.guests = guests;

                    await this.experienceSlotBookingsRepo.save(newBookingSlot);

                } else {
                    const slot = new ExperienceSpecificDateSlotsEntity();
                    // slot.experienceBookingId = bookingId;
                    slot.experienceBookingType = bookingType;
                    slot.experienceSpecificDateId = existing.id;
                    slot.fhour = from;
                    slot.thour = to;
                    slot.slotAvailablity = SlotAvailability.BOOKED
                    slot.minSeat = guests;
                    slot.maxSeat = guests;

                    const createdSlot = await this.experienceSpecificDatesSlotsRepo.save(slot);

                    const newBookingSlot = new ExperienceSlotBookingsEntity();
                    newBookingSlot.experienceBookingId = Number(bookingId);
                    newBookingSlot.specificSlotId = createdSlot.id;
                    newBookingSlot.guests = guests;

                    await this.experienceSlotBookingsRepo.save(newBookingSlot);
                }
            } else {
                const slotDate = new ExperienceSpecificDatesEntity()
                slotDate.experienceId = experienceId;
                slotDate.experienceDayOpen = ExperienceDayOpenEnum.OPEN;
                slotDate.experienceType = isPrivate ? ExperienceType.PRIVATE : ExperienceType.PUBLIC;
                slotDate.experienceWholeDay = ExperienceWholeDayEnum.WHOLE_DAY;
                slotDate.date = new Date(selectedDate).toISOString().split('T')[0];


                const slotDateCreated = await this.experienceSpecificDatesRepo.save(slotDate);

                const slot = new ExperienceSpecificDateSlotsEntity();
                // slot.experienceBookingId = bookingId;
                slot.experienceBookingType = bookingType;
                slot.experienceSpecificDateId = slotDateCreated.id;
                slot.fhour = from;
                slot.thour = to;
                slot.slotAvailablity = SlotAvailability.BOOKED;
                slot.minSeat = guests;
                slot.maxSeat = guests;

                await this.experienceSpecificDatesSlotsRepo.save(slot)

            }
        } else {
            const existing = experience.experienceBulkDates.find(item => item.day == selectedDate.getDay() && item.experienceType == (isPrivate ? ExperienceType.PRIVATE : ExperienceType.PUBLIC))
            if (existing) {
                const slotExist = existing.experienceBulkSlots.find(item => item.fhour == from && item.thour == to)

                if (slotExist) {
                    const newBookingSlot = new ExperienceSlotBookingsEntity();
                    newBookingSlot.experienceBookingId = Number(bookingId);
                    newBookingSlot.bulkSlotId = slotExist.id;
                    newBookingSlot.guests = guests;

                    await this.experienceSlotBookingsRepo.save(newBookingSlot);
                }
            }
        }
    }

    async createMessage(userId: string, bookingId: string, selectedDate: Date, fhour: number, thour: number, messageToHost: string, messageType: MessageTypeEnum, hostId: string) {
        const existingInbox = await this.inboxRepo.findOne({
            where: {
                guestId: userId,
                hostId
            }
        })

        let inboxId: string;

        if (existingInbox) {
            inboxId = existingInbox.id;
        } else {
            const inbox = new Inbox()
            inbox.guestId = userId;
            inbox.hostId = userId

            const inboxSaved = await this.inboxRepo.save(inbox)
            inboxId = inboxSaved.id;
        }

        const message = new Message()
        message.experienceBookingId = bookingId;
        message.messageType = messageType;
        message.startDate = selectedDate;
        message.endTime = thour
        message.startTime = fhour
        message.inboxId = inboxId;
        message.senderId = userId;
        message.message = messageToHost;

        await this.messageRepo.save(message)

        return inboxId;
    }

    async makePayment(bookingDto: ExperienceBookingDto, userId: string) {
        const { date, id, isPrivate, guests, from, to, message: messageToHost, companyName, companyNIT, companyPhone, companyEmail, bookingType } = bookingDto;
        const selectedDate = new Date(date);
        const day = selectedDate ? (selectedDate.getDay()) : undefined;


        const experience = await this.experienceListingRepo.findOne({
            relations: {
                experienceBulkDates: {
                    experienceBulkSlots: true
                },
                experienceSpecificDates: {
                    experienceSpecificDatesSlots: true
                },
                user: {
                    profile: true
                },
                step2: true,
                step5: {
                    privateStep5: true,
                    publicStep5: true
                }
            },
            where: {
                id,
                // experienceBulkDates: {
                //     day,
                //     experienceBulkSlots: {
                //         fhour: from,
                //         thour: to
                //     }
                // },
                // experienceSpecificDates: {
                //     date: selectedDate,
                //     experienceSpecificDatesSlots: {
                //         fhour: from,
                //         thour: to
                //     }
                // }
            }
        })

        // console.log("Experience123456789",experience);





        if (!experience) {
            throw new BadRequestException("Invalid experience")
        }

        let categoryServiceFee = 0, hostServiceFee = 0;
        let vatResponsible = false;

        let coupon: CouponCode | undefined = undefined;
        let credit: Credits | undefined = undefined;

        if (bookingDto.promoCode) {
            const resCo = await fetch(config().CORE_URL + `/coupon-codes/code/${bookingDto.promoCode}?userId=${userId}`)
            const respCo: { data: CouponCode, statusCode: number, message: string } = (await resCo.json()) as { data: CouponCode, statusCode: number, message: string };

            if (respCo.data && respCo.statusCode === 200) {
                coupon = respCo.data;
            } else {
                throw new BadRequestException(respCo.message);
            }
        }

        const resCr = await fetch(config().CORE_URL + `/coupon-codes/user/${userId}/credit`)
        const respCr: { data: Credits } = (await resCr.json()) as { data: Credits };

        if (respCr.data) {
            credit = respCr.data;
        }

        const resC = await fetch(config().CORE_URL + `/site/category/service-fee/${experience.categoryId}`)
        const respC: { data: number } = (await resC.json()) as { data: number };


        if (respC.data) {
            categoryServiceFee = respC.data;
        }

        const resH = await fetch(config().CORE_URL + `/site/host/service-fee/${experience.userId}`)
        const respH: { data: { serviceFee: number, vatResponsible: boolean } } = (await resH.json()) as { data: { serviceFee: number, vatResponsible: boolean } };


        if (respH.data) {
            hostServiceFee = respH.data.serviceFee;
            vatResponsible = respH.data.vatResponsible;
        }


        const homeBulkTimings = (day !== undefined) ? experience.experienceBulkDates.find(days => {
            return (days.day == day) && days.experienceType == ExperienceType.PRIVATE
        }) : undefined;

        const siteBulkTimings = (day !== undefined) ? experience.experienceBulkDates.find(days => {
            return (days.day == day) && days.experienceType == ExperienceType.PUBLIC
        }) : undefined;

        const homeSpecificTimings = (selectedDate) ? experience.experienceSpecificDates.find(days => {
            return (isSameDay(days.date, selectedDate)) && days.experienceType == ExperienceType.PRIVATE
        }) : undefined;

        const siteSpecificTimings = (selectedDate) ? experience.experienceSpecificDates.find(days => {
            return (isSameDay(days.date, selectedDate)) && days.experienceType == ExperienceType.PUBLIC
        }) : undefined;

        if (isPrivate) {
            if (experience.step5.availabilityType == ExperienceAvailabilityType.STORE) throw new BadRequestException("Private session unavailable")
            if ((homeSpecificTimings?.experienceDayOpen == ExperienceDayOpenEnum.CLOSED && homeBulkTimings?.experienceDayOpen == ExperienceDayOpenEnum.CLOSED)) {
                throw new BadRequestException("Private session unavaclosedilable")
            }
        } else {
            if (experience.step5.availabilityType == ExperienceAvailabilityType.HOME) throw new BadRequestException("Public session unavailable")
            if ((siteBulkTimings?.experienceDayOpen == ExperienceDayOpenEnum.CLOSED && siteSpecificTimings?.experienceDayOpen == ExperienceDayOpenEnum.CLOSED)) {
                throw new BadRequestException("Public session closed")
            }
        }

        const privateSlots = (homeSpecificTimings?.experienceSpecificDatesSlots || []).filter(slot => slot.experienceBookingType == bookingType && (slot.slotAvailablity == SlotAvailability.OPEN || slot.slotAvailablity == null) && slot.minSeat <= guests && slot.maxSeat >= guests)
        const privateBulkSlots = (homeBulkTimings?.experienceBulkSlots || []).filter(slot => slot.experienceBookingType == bookingType && slot.minSeat <= guests && slot.maxSeat >= guests)
        const publicSlots = (siteSpecificTimings?.experienceSpecificDatesSlots || []).filter(slot => slot.experienceBookingType == bookingType && (slot.slotAvailablity == SlotAvailability.OPEN || slot.slotAvailablity == null) && slot.minSeat <= guests && slot.maxSeat >= guests)
        const publicBulkSlots = (siteBulkTimings?.experienceBulkSlots || []).filter(slot => slot.experienceBookingType == bookingType && slot.minSeat <= guests && slot.maxSeat >= guests)


        let slot: ExperienceBulkDateSlotsEntity | ExperienceSpecificDateSlotsEntity, specialPrice: number, slotType: number = 2;
        if (isPrivate) {
            slot = privateSlots.find(slot => slot.fhour == from && slot.thour == to)
            if (!slot) {
                slot = privateBulkSlots.find(slot => slot.fhour == from && slot.thour == to)
                slotType = 1;
            }
            specialPrice = slot?.specialPrice;
        } else {
            slot = publicSlots.find(slot => slot.fhour == from && slot.thour == to)
            if (!slot) {
                slot = publicBulkSlots.find(slot => slot.fhour == from && slot.thour == to)
                slotType = 1;
            }
            specialPrice = slot?.specialPrice;
        }

        if (!slot) {
            throw new BadRequestException("Slot is not available please choose different one")
        }

        const singleGuestPrice = specialPrice ? specialPrice : (isPrivate ? experience.step5?.privateStep5?.basePrice || 0 : experience.step5?.publicStep5?.basePrice || 0);


        const { multiGuestPrice, total, guestServiceFee, vatBasePrice, vatGuestServiceFee, balanceCredits, discountedTotal, creditsAppliedTotal, creditsApplied } = calculateBreakup(singleGuestPrice, guests, vatResponsible, categoryServiceFee, hostServiceFee, coupon?.couponValue, coupon?.couponType, credit?.credit);
        if (coupon?.minAmount) {
            if (total < coupon?.minAmount) {
                throw new BadRequestException("Coupon code is not applicable for this booking min amount should be " + coupon.minAmount);
            }
        }

        console.log({
            total, discountedTotal, creditsAppliedTotal, balanceCredits
        });

        // return;



        const booking = new ExperienceBookingEntity()
        booking.experienceId = id;
        booking.userId = userId;
        booking.basePrice = multiGuestPrice;
        booking.avgBasePrice = singleGuestPrice;
        booking.guests = guests;
        booking.serviceFee = categoryServiceFee;
        booking.hostServiceFee = hostServiceFee;
        booking.total = total;
        booking.discountedTotal = discountedTotal;
        booking.creditsAppliedTotal = creditsAppliedTotal;
        booking.creditsApplied = creditsApplied;
        booking.cleaningFee = 0;
        booking.tax = 19;
        booking.date = selectedDate;
        booking.discount = coupon?.couponValue || 0;
        booking.discountType = coupon ? coupon.couponType : COUPON_CODE_TYPE_ENUM.FIXED;
        booking.cancellationId = 1;
        if (bookingType == ExperienceBookingTypeEnum.INSTANT) booking.bookingStatus = ExperienceBookingStatus.APPROVED
        booking.experienceType = isPrivate ? ExperienceType.PRIVATE : ExperienceType.PUBLIC;
        booking.bookingType = bookingType;
        booking.startTime = slot.fhour;
        booking.endTime = slot.thour;
        booking.cancellationPolicy = experience.step5.cancellationPolicy;
        booking.vatResponsible = vatResponsible ? YesNo.YES : YesNo.NO;
        booking.companyName = companyName;
        booking.companyNIT = companyNIT;
        booking.companyPhone = companyPhone;
        booking.companyEmail = companyEmail;

        const bookingCreated = await this.experienceBookingRepo.save(booking);

    

        if (coupon) {
            const couponUsage = new CouponCodeUsage();
            couponUsage.couponCode = coupon.id;
            couponUsage.userId = userId;
            couponUsage.bookingId = bookingCreated.id;
            await this.couponCodeUsageRepo.save(couponUsage);
        }

        if (balanceCredits > 0) {
            const credit = new Credits();
            credit.userId = userId;
            credit.bookingId = bookingCreated.id;
            credit.credit = balanceCredits;
            credit.expiryDate = coupon?.expiresAt ? coupon.expiresAt : (credit ? credit.expiryDate : null);
            await this.creditsRepo.save(credit);
        }

        if (credit) {
            await this.creditsRepo.update({
                userId: userId,
                id: credit.id
            }, {
                status: CreditStatus.USED,
                usedBookingId: bookingCreated.id
            });
        }

        if (creditsAppliedTotal == 0 && bookingType == ExperienceBookingTypeEnum.INSTANT) {
            const history = new ExperiencePaymentHistoryEntity()

            history.bookingId = bookingCreated.id;
            history.paymentId = "";
            history.paymentStatus = PaymentStatus.PAYMENT_COMPLETED

            await this.experiencePaymentHistoryRepo.save(history)

            await this.blockSlot(experience.id, selectedDate, isPrivate, from, to, guests, bookingType, bookingCreated.id);
            const inboxId = await this.createMessage(userId, bookingCreated.id, selectedDate, slot.fhour, slot.thour, messageToHost, MessageTypeEnum.NEW_EXPERIENCE_BOOKING, experience.userId);
            return {
                id: bookingCreated.id,
                inboxId,
                total: creditsAppliedTotal
            }

        }

        if (bookingType == ExperienceBookingTypeEnum.REQUEST) {
            await this.blockSlot(experience.id, selectedDate, isPrivate, from, to, guests, bookingType, bookingCreated.id);

            const inboxId = await this.createMessage(userId, bookingCreated.id, selectedDate, slot.fhour, slot.thour, messageToHost, MessageTypeEnum.EXPERIENCE_REQUESTED, experience.userId);

            const guest = await this.experienceBookingRepo.findOne({
                where: {
                    id: bookingCreated.id
                },
                relations: {
                    user: {
                        profile: true
                    }
                }
            })

            // const hostName = host?.name || 'Host';
            const hostName = experience.user.profile.firstName || 'Host';
            const guestName = guest?.user?.profile?.firstName || 'Guest';
            const hostEmail = experience.user.email || 'host@example.com';
            // const guestName = guest?.name || 'Guest';
            const listingTitle = (experience)?.step2?.title || 'Experience';
            const bookingDates = selectedDate.toDateString();
            const requestUrl = `${config().SITE_HOST}/user/inbox/${inboxId}`;
            const bookingDate = format(selectedDate, 'yyyy-MM-dd');
            const bookingTime = `${slot.fhour} - ${slot.thour}`;

            try {
                await fetch(`${config().CORE_URL}/mailer/send-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: hostEmail,
                        subject: "New Booking Request Received!",
                        templateName: 'requestBooking',
                        context: {
                            hostName,
                            guestName,
                            listingTitle,
                            bookingDates,
                            bookingDate,
                            bookingTime,
                            requestUrl,
                            currentYear: new Date().getFullYear(),
                            siteName: 'Momenta Boutique'
                        }
                    })
                });
            } catch (error) {
                // this.logger.error('Failed to send request booking email', error);
                console.log("Failed to send request booking email");
            }

            return {
                id: bookingCreated.id,
                inboxId,
                total: creditsAppliedTotal
            }
        }

        // await this.blockSlot(experience.id, selectedDate, isPrivate, from, to, guests, bookingType, bookingCreated.id);
        // const inboxId = await this.createMessage(userId, bookingCreated.id, selectedDate, slot.fhour, slot.thour, messageToHost, MessageTypeEnum.NEW_EXPERIENCE_BOOKING, experience.userId);


        // await this.blockSlot(experience.id, selectedDate, isPrivate, from, to, guests, bookingType, bookingCreated.id);
        // const inboxId = await this.createMessage(userId, bookingCreated.id, selectedDate, slot.fhour, slot.thour, messageToHost, MessageTypeEnum.NEW_EXPERIENCE_BOOKING);

        return {
            id: bookingCreated.id,
            // inboxId,
            total: creditsAppliedTotal
        }

    }

    async getBooking(id: string) {
        const booking = await this.experienceBookingRepo.findOne({
            where: {
                id
            },
            relations: {
                user: {
                    profile: true
                },
                // property: {
                payment: true,
                hostProposal: true,
                experience: {
                    user: {
                        profile: true
                    },
                    step3: {
                        coverImage: true
                    },
                    step5: {
                        privateStep5: true,
                        publicStep5: true
                    },
                    step2: true,

                },
                messages: {
                    inbox: true
                },
                refund: true,
                payout: true,
                cancellation: true
            }
        })

        return booking;
    }

    async payRequestBooking(userId: string, id: string) {
        const booking = await this.experienceBookingRepo.findOne({
            where: {
                id,
                userId,
                // bookingStatus: ExperienceBookingStatus.APPROVED
            },
            relations: {
                payment: true,
                hostProposal: true
            }

        })

        if (!booking || booking.payment) {
            throw new BadRequestException()
        }

        const hostProposal = booking.hostProposal;

        if (hostProposal) {


            const oldBooking = new ExperienceOldBookingEntity()
            oldBooking.basePrice = booking.basePrice;
            oldBooking.avgBasePrice = booking.avgBasePrice;
            oldBooking.serviceFee = booking.serviceFee;
            oldBooking.hostServiceFee = booking.hostServiceFee;
            oldBooking.total = booking.total;
            oldBooking.cleaningFee = 0;
            oldBooking.tax = 0
            oldBooking.discount = booking.discount;
            oldBooking.experienceBookingId = booking.id;
            oldBooking.date = booking.date;
            oldBooking.guests = booking.guests;
            oldBooking.startTime = booking.startTime;
            oldBooking.endTime = booking.endTime
            oldBooking.experienceType = booking.experienceType;

            await this.oldBookingRepo.save(oldBooking)

            const experienceBooking = new ExperienceBookingEntity()
            experienceBooking.basePrice = hostProposal.basePrice;
            experienceBooking.avgBasePrice = hostProposal.avgBasePrice;
            experienceBooking.serviceFee = hostProposal.serviceFee;
            experienceBooking.hostServiceFee = hostProposal.hostServiceFee;
            experienceBooking.total = hostProposal.total;
            experienceBooking.cleaningFee = 0;
            experienceBooking.tax = 0
            experienceBooking.discount = hostProposal.discount;
            experienceBooking.date = hostProposal.date;
            experienceBooking.guests = hostProposal.guests;
            experienceBooking.startTime = hostProposal.startTime;
            experienceBooking.endTime = hostProposal.endTime
            experienceBooking.experienceType = hostProposal.experienceType;

            await this.experienceBookingRepo.update({
                id: booking.id
            }, experienceBooking)

            await this.hostProposalRepo.delete({
                id: hostProposal.id
            })



        }

        // const history = new ExperiencePaymentHistoryEntity()

        // history.bookingId = id;
        // history.paymentId = "";
        // history.paymentStatus = PaymentStatus.PAYMENT_COMPLETED

        // await this.experiencePaymentHistoryRepo.save(history)

        const lastMessage = await this.messageRepo.findOne({
            where: {
                experienceBookingId: id
            },
            order: {
                createdAt: "DESC"
            }
        })

        const message = new Message()
        message.experienceBookingId = id;
        message.messageType = MessageTypeEnum.NEW_EXPERIENCE_BOOKING
        message.startDate = lastMessage.startDate;
        message.endTime = lastMessage.startTime
        message.startTime = lastMessage.endTime
        message.inboxId = lastMessage.inboxId;
        message.senderId = userId;

        await this.messageRepo.save(message)

        return {
            id: booking.id,
            total: hostProposal.total || booking.total
        }


    }

    async getTrips(userId: string, type: "previous" | "upcoming") {
        console.log({ userId });
        return await this.experienceBookingRepo.find({
            relations: {
                user: {
                    profile: true
                },
                experience: {
                    step1: true,
                    step2: true,
                    step3: true,
                    step5: {
                        privateStep5: true,
                        publicStep5: true,
                        cityData: true
                    },
                    user: {
                        profile: true
                    }
                },
                payment: true,
                dispute: true
            },
            where: {
                userId,
                // payment: {
                //     paymentStatus: PaymentStatus.PAYMENT_COMPLETED
                // },
                ...(type == "previous" ? {
                    bookingStatus: In([
                        ExperienceBookingStatus.COMPLETED,
                        ExperienceBookingStatus.CANCELLEDBYUSER,
                        ExperienceBookingStatus.CANCELLEDBYHOST,
                    ])
                } : {
                    bookingStatus: In([
                        ExperienceBookingStatus.APPROVED
                    ]),
                    date: MoreThan(new Date())
                })
            }
        })
    }

    async getBookings(userId: string, type: "previous" | "upcoming") {
        return await this.experienceBookingRepo.find({
            relations: {
                user: {
                    profile: true
                },
                experience: {
                    step1: true,
                    step2: true,
                    step3: true,
                    step5: {
                        privateStep5: true,
                        publicStep5: true
                    },
                    user: {
                        profile: true
                    }
                },
                payment: true,
                dispute: true
            },
            where: {
                experience: {
                    userId: userId
                },
                // payment: {
                //     paymentStatus: PaymentStatus.PAYMENT_COMPLETED
                // },
                ...(type == "previous" ? {
                    bookingStatus: In([
                        ExperienceBookingStatus.COMPLETED,
                        ExperienceBookingStatus.CANCELLEDBYUSER,
                        ExperienceBookingStatus.CANCELLEDBYHOST,
                    ])
                } : {
                    bookingStatus: In([
                        ExperienceBookingStatus.APPROVED
                    ])
                })
            }
        })
    }

    async wombiCallback(id: string, query: any) {
        const paymentStatus = await this.experiencePaymentHistoryRepo.findOne({
            where: {
                bookingId: id,
            }
        })

        if (!paymentStatus) {
            const history = new ExperiencePaymentHistoryEntity()

            history.bookingId = id;
            history.paymentId = "";
            history.paymentStatus = PaymentStatus.PAYMENT_INITIATED

            await this.experiencePaymentHistoryRepo.save(history)
        }

    }

    async wombiwebhook(body: TransactionUpdatedEvent) {

        if (body.event == "transaction.updated") {

            const bookingId = body.data.transaction.reference;


            if (body.data.transaction.status == "APPROVED") {
                const paymentStatus = await this.experiencePaymentHistoryRepo.findOne({
                    where: {
                        bookingId: bookingId,
                    },
                    relations: {
                        booking: {
                            experience: true
                        }
                    }
                })

                if (!paymentStatus) {
                    const history = new ExperiencePaymentHistoryEntity()

                    history.bookingId = bookingId;
                    history.paymentId = body.data.transaction.id;
                    history.paymentStatus = PaymentStatus.PAYMENT_COMPLETED

                    await this.experiencePaymentHistoryRepo.save(history)
                } else {
                    await this.experiencePaymentHistoryRepo.update({
                        id: paymentStatus.id
                    }, {
                        paymentStatus: PaymentStatus.PAYMENT_COMPLETED,
                        paymentId: body.data.transaction.id
                    })
                }

                await this.blockSlot(paymentStatus.booking.experienceId, paymentStatus.booking.date, paymentStatus.booking.experienceType == ExperienceType.PRIVATE, paymentStatus.booking.startTime, paymentStatus.booking.endTime, paymentStatus.booking.guests, paymentStatus.booking.bookingType, bookingId);
                await this.createMessage(paymentStatus.booking.userId, bookingId, paymentStatus.booking.date, paymentStatus.booking.startTime, paymentStatus.booking.endTime, "", MessageTypeEnum.NEW_EXPERIENCE_BOOKING, paymentStatus.booking.experience.userId);
            }

        }

    }

     async getAllBookingsCSV(res: Response) {
        const query = this.experienceBookingRepo.createQueryBuilder("booking")
            .leftJoinAndSelect("booking.user", "user")
            .leftJoinAndSelect("user.profile", "profile")
            .leftJoinAndSelect("booking.experience", "experience")
            .leftJoinAndSelect("experience.user", "experienceUser")
            .leftJoinAndSelect("experienceUser.profile", "experienceUserProfile")
            .leftJoinAndSelect("experience.category", "category")
            .leftJoinAndSelect("experience.step2", "step2")
            .leftJoinAndSelect("booking.payment", "payment")
            .leftJoinAndSelect("booking.coupon", "coupon")
            .leftJoinAndSelect("booking.payout", "payout")
            .leftJoinAndSelect("booking.refund", "refund")
            .leftJoinAndSelect("booking.cancellation", "cancellation")
            .leftJoinAndSelect("booking.dispute", "dispute")
            .leftJoinAndSelect("booking.reviews", "reviews")
            .leftJoinAndSelect("booking.messages", "messages")
            .orderBy("booking.createdAt", "DESC")

        const data = await query.getMany();

        const formattedData = data.map(booking => {

            const { host: { finalPayoout, hostServiceFee }, guestServiceFee } = calculateBreakup(booking.avgBasePrice, booking.guests, booking.vatResponsible == YesNo.YES ? true : false, booking.serviceFee, booking.hostServiceFee, booking.discount, booking.discountType, 0);

            return {
                BookingID: booking.id,
                Status: booking.bookingStatus,
                ExperienceTitle: booking.experience.step2.title,
                HostName: `${booking.experience.user?.profile.firstName} ${booking.experience.user?.profile.lastName}`,
                GuestName: `${booking.user?.profile.firstName} ${booking.user?.profile.lastName}`,
                Date: new Date(booking.date).toDateString(),
                Guests: booking.guests,
                PaymentStatus: booking.payment ? booking.payment?.paymentStatus : 'N/A',
                CreatedAt: new Date(booking.createdAt).toDateString(),
                RequestedDate: new Date(booking.createdAt).toDateString(),
                PaymentDate: booking.payment ? new Date(booking.payment.updatedAt).toDateString() : 'N/A',
                ExpectedPayoutDate: booking.payout ? new Date(booking.payout.expectedDate).toDateString() : 'N/A',
                payout: finalPayoout,
                Commission: hostServiceFee,
                serviceFee: guestServiceFee,
                total: booking.creditsAppliedTotal,
                currency: booking.currency || 'USD'

            }
        });

        const parser = new Parser();
        const csv = parser.parse(formattedData);

        // Set headers and return CSV
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename="booking.csv"');
        res.send(csv);

    }

    async getAllBookings(page: number,
        limit: number,
        search: string,
        sortColumn?: "status" | "requestDate" | "paymentDate" | "expDate" | "totalPayment",
        sortOrder?: "ASC" | "DESC",
        status?: ExperienceBookingStatus,
        category?: string,
        filterDateBy?: string,
        startDate?: string,
        endDate?: string,
    ) {
        const query = this.experienceBookingRepo.createQueryBuilder("booking")
            .leftJoinAndSelect("booking.user", "user")
            .leftJoinAndSelect("user.profile", "profile")
            .leftJoinAndSelect("booking.experience", "experience")
            .leftJoinAndSelect("experience.user", "experienceUser")
            .leftJoinAndSelect("experienceUser.profile", "experienceUserProfile")
            .leftJoinAndSelect("experience.category", "category")
            .leftJoinAndSelect("experience.step2", "step2")
            .leftJoinAndSelect("booking.payment", "payment")
            .leftJoinAndSelect("booking.coupon", "coupon")
            .leftJoinAndSelect("booking.payout", "payout")
            .leftJoinAndSelect("booking.refund", "refund")
            .leftJoinAndSelect("booking.cancellation", "cancellation")
            .leftJoinAndSelect("booking.dispute", "dispute")
            .leftJoinAndSelect("booking.reviews", "reviews")
            .leftJoinAndSelect("booking.messages", "messages")
            .orderBy("booking.createdAt", "DESC")
            .take(limit)
            .skip((page - 1) * limit)
        // .where("payment.paymentStatus = :status", { status: PaymentStatus.PAYMENT_COMPLETED });

        if (search) {
            query.andWhere("(user.profile.firstName ILIKE :search OR user.profile.lastName ILIKE :search OR step2.title ILIKE :search)", { search: `%${search}%` })
        }

        if (filterDateBy && startDate && endDate) {
            if (filterDateBy == 'request') {
                query.andWhere("booking.createdAt BETWEEN :startDate AND :endDate", { startDate: new Date(startDate), endDate: new Date(endDate) })
            }

            if (filterDateBy == 'experience') {
                query.andWhere("booking.date BETWEEN :startDate AND :endDate", { startDate: new Date(startDate), endDate: new Date(endDate) })
            }

            if (filterDateBy == 'expected') {
                query.andWhere("payout.expectedDate BETWEEN :startDate AND :endDate", { startDate: new Date(startDate), endDate: new Date(endDate) })
            }

            if (filterDateBy == 'payment') {
                query.andWhere("payment.createdAt BETWEEN :startDate AND :endDate", { startDate: new Date(startDate), endDate: new Date(endDate) })
            }
        }

        if (sortColumn && sortOrder) {
            if (sortColumn == 'status') {
                query.orderBy('booking.bookingStatus', sortOrder)
            }

            if (sortColumn == 'requestDate') {
                query.orderBy('booking.createdAt', sortOrder)
            }

            if (sortColumn == 'paymentDate') {
                query.orderBy('payment.updatedAt', sortOrder)
            }

            if (sortColumn == 'expDate') {
                query.orderBy('booking.date', sortOrder)
            }

            if (sortColumn == 'totalPayment') {
                query.orderBy('booking.total', sortOrder)
            }
        }

        if (status) {
            query.andWhere('booking.bookingStatus = :status', { status })
        }

        if (category) {
            query.andWhere('experience.categoryId = :category', { category })
        }

        const [data, total] = await query.getManyAndCount();

        return {
            data, total
        }
    }

    cancellationPolicies = [
        {
            id: 1,
            title: 'Flexible',
            description: 'Full refund 1 day prior to arrival, except fees',
            icon: 'https://a.travel-assets.com/vx/resources/images/2023/03/30/16/20/0c4f1b2d-5e6f-4b8e-9a7c-0d1f3a2b5c7e.png',
            gracePeriod: 1,
            beforeGracePeriodRefund: 100,
            afterGracePeriod: 0,
            afterGracePeriodRefund: 0,
            afterCheckIn: 0,
            afterCheckInRefund: 0,
        },
        {
            id: 2,
            title: 'Moderate',
            description: 'Full refund 3 day prior to arrival, except fees',
            icon: 'https://a.travel-assets.com/vx/resources/images/2023/03/30/16/20/0c4f1b2d-5e6f-4b8e-9a7c-0d1f3a2b5c7e.png',
            gracePeriod: 3,
            beforeGracePeriodRefund: 100,
            afterGracePeriod: 0,
            afterGracePeriodRefund: 0,
            afterCheckIn: 0,
            afterCheckInRefund: 0,
        },
        {
            id: 3,
            title: 'Strict',
            description: 'Full refund 7 day prior to arrival, except fees',
            icon: 'https://a.travel-assets.com/vx/resources/images/2023/03/30/16/20/0c4f1b2d-5e6f-4b8e-9a7c-0d1f3a2b5c7e.png',
            gracePeriod: 7,
            beforeGracePeriodRefund: 50,
            afterGracePeriod: 0,
            afterGracePeriodRefund: 0,
            afterCheckIn: 0,
            afterCheckInRefund: 0,
        }
    ]

    async cancelBooking(bookingId: string, userId: string, message: string) {
        const booking = await this.experienceBookingRepo.findOne({
            where: {
                id: bookingId,
                userId,
                bookingStatus: In([
                    ExperienceBookingStatus.APPROVED
                ])
            },
            relations: {
                experience: true
            }
        })

        if (!booking) {
            throw new BadRequestException("Invalid booking")
        }

        const cancellationPolicy = this.cancellationPolicies.find(item => item.id === Number(booking.cancellationPolicy || 1)) || this.cancellationPolicies[0];

        const startDate = new Date(booking.date); // Check-in
        const cancellationDate = new Date(); // Cancellation date

        // 1. Total nights

        // 2. Nights before cancellation
        const nightsBeforeCancellation = differenceInCalendarDays(startDate, cancellationDate);

        const isBeforeGracePeriod = nightsBeforeCancellation > cancellationPolicy.gracePeriod;

        const isBeforeCheckIn = isBefore(cancellationDate, startDate);

        // Or you could say:
        const isDuringOrAfterCheckIn = !isBefore(cancellationDate, startDate);

        // Optional: is it on the same day as check-in?
        const isSameAsCheckIn = isSameDay(cancellationDate, startDate);


        let refundPercentage = 0;

        if (isBeforeGracePeriod) {
            // Before grace period
            refundPercentage = cancellationPolicy.beforeGracePeriodRefund;
        } else if (isDuringOrAfterCheckIn) {
            // During or after check-in
            refundPercentage = cancellationPolicy.afterCheckInRefund;
        } else if (isSameAsCheckIn) {
            // On the same day as check-in
            refundPercentage = cancellationPolicy.afterCheckInRefund;
        } else if (isBeforeCheckIn) {
            // After grace period but before check-in
            refundPercentage = cancellationPolicy.afterGracePeriodRefund;
        }
        const refundAmount = booking.total * refundPercentage / 100;
        const payoutPercentage = 100 - refundPercentage;

        const { host: { finalPayoout } } = calculateBreakup(booking.avgBasePrice, booking.guests, booking.vatResponsible == YesNo.YES, booking.serviceFee, booking.hostServiceFee)

        const totalRefund = Number((refundAmount).toFixed(2));

        const hostPayout = Number(((finalPayoout * payoutPercentage) / 100).toFixed(2));

        console.log({
            totalRefund,
            hostPayout,
            message
        });



        const cancellation = this.experienceCancellationRepo.create({
            bookingId,
            refund: totalRefund,
            currency: booking.currency,
            payout: hostPayout,
            message
        })

        await this.experienceCancellationRepo.save(cancellation)

        const refund = this.experienceRefundRepo.create({
            bookingId,
            refund: totalRefund,
            message
        })

        await this.experienceRefundRepo.save(refund)


        const payout = this.experiencePayoutRepo.create({
            bookingId,
            payout: hostPayout,
            message
        })

        await this.experiencePayoutRepo.save(payout)

        await this.experienceBookingRepo.update({
            id: bookingId
        }, {
            bookingStatus: ExperienceBookingStatus.CANCELLEDBYUSER
        })

        const existingInbox = await this.inboxRepo.findOne({
            where: {
                guestId: userId,
                hostId: booking.experience.userId
            }
        })

        let inboxId: string;

        if (existingInbox) {
            inboxId = existingInbox.id;
        } else {
            const inbox = new Inbox()
            inbox.guestId = userId;
            inbox.hostId = booking.experience.userId

            const inboxSaved = await this.inboxRepo.save(inbox)
            inboxId = inboxSaved.id;
        }

        const messageE = new Message()
        messageE.experienceBookingId = bookingId;
        messageE.inboxId = inboxId;
        messageE.senderId = userId;
        messageE.message = message;
        messageE.messageType = MessageTypeEnum.CANCELLEDBYUSER

        await this.messageRepo.save(messageE)

        // await this.experienceSpecificDatesSlotsRepo.update({
        //     experienceBookingId: bookingId
        // }, {
        //     slotAvailablity: SlotAvailability.OPEN,
        //     experienceBookingId: null
        // })

        return true;
    }

    async wombiwebhookPayout(body: PayoutUpdatedEvent) {

        if (body.event == "payout.updated") {

            const payoutId = body.data.payout.id;

            await this.experiencePayoutRepo.update({
                wompiId: payoutId
            }, {
                wompStatus: body.data.payout.status
            })
        }

    }

    async bookingStats() {
        const pendingBookings = await this.experienceBookingRepo.count({
            where: {
                bookingStatus: ExperienceBookingStatus.PENDING
            }
        })
        const approvedBookings = await this.experienceBookingRepo.count({
            where: {
                bookingStatus: ExperienceBookingStatus.APPROVED
            }
        })
        const cancelledBookings = await this.experienceBookingRepo.count({
            where: {
                bookingStatus: In([
                    ExperienceBookingStatus.CANCELLEDBYUSER,
                    ExperienceBookingStatus.CANCELLEDBYHOST
                ])
            }
        })
        const completedBookings = await this.experienceBookingRepo.count({
            where: {
                bookingStatus: ExperienceBookingStatus.COMPLETED
            }
        })

        const expiredBookings = await this.experienceBookingRepo.count({
            where: {
                bookingStatus: ExperienceBookingStatus.EXPIRED
            }
        })
        return { pendingBookings, approvedBookings, cancelledBookings, completedBookings, expiredBookings };
    }
}
