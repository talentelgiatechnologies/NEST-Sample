import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Between, IsNull, Repository } from 'typeorm';
import { CreateHostDto, UpdateBankDto, UpdateBasicDto, UpdateHostTerm, UpdateTaxDto } from './dto/create-host.dto';
import { UpdateHostDto } from './dto/update-host.dto';
import { HostEntity } from 'database/enitity/host/Host.entity';
import { EXPERIENCE_BOOKING, EXPERIENCE_LISTING, HOST, HOST_BANK, HOST_BASIC, HOST_CONTACT, HOST_DOCUMENT, HOST_SERVICE_FEE, HOST_TAX, SERVICE_FEE, USER, USER_LEGAL_CONSENT } from 'database/constants';
import { HostDocumentEntity, HostDocumentType } from 'database/enitity/host/HostDocument.entity';
import { HostContactEntity } from 'database/enitity/host/HostContact.entity';
import { HostTaxEntity } from 'database/enitity/host/HostTax.entity';
import { HostBankEntity } from 'database/enitity/host/HostBank.entity';
import { HostBasicEntity } from 'database/enitity/host/HostBasic.entity';
import { FeeType, ServiceFee, ServiceFeeEnum } from 'database/enitity/ServiceFee.entity';
import { HostServiceFee } from 'database/enitity/host/HostServiceFee.entity';
import { User } from 'database/enitity/User.entity';
import { MailerService } from '../mailer/mailer.service';
import { format } from 'date-fns';
import { PaymentStatus } from 'database/enitity/ExperiencePaymentHistory.entity';
import { ExperienceBookingEntity } from 'database/enitity/ExperienceBooking.entity';
import { ExperienceListingEntity } from 'database/enitity/Experience.entity';
import { ExperiencePublishType, ExperienceStatusType } from 'database/enitity/ExperienceStatus.entity';
import { LegalDocumentType, UserLegalConsent } from 'database/enitity/UserLegalConsent';

@Injectable()
export class HostService {
  constructor(
    @Inject(HOST)
    private readonly hostRepository: Repository<HostEntity>,
    @Inject(HOST_DOCUMENT)
    private readonly documentRepository: Repository<HostDocumentEntity>,
    @Inject(HOST_CONTACT)
    private readonly contactRepository: Repository<HostContactEntity>,
    @Inject(HOST_TAX)
    private readonly taxRepository: Repository<HostTaxEntity>,
    @Inject(HOST_BANK)
    private readonly bankRepository: Repository<HostBankEntity>,
    @Inject(HOST_BASIC)
    private readonly basicRepository: Repository<HostBasicEntity>,
    @Inject(SERVICE_FEE)
    private readonly serviceFeeRepo: Repository<ServiceFee>,
    @Inject(HOST_SERVICE_FEE)
    private readonly hostServiceRepository: Repository<HostServiceFee>,
    @Inject(USER)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    @Inject(EXPERIENCE_BOOKING)
    private readonly experienceBookingRepository: Repository<ExperienceBookingEntity>,
    @Inject(EXPERIENCE_LISTING)
    private readonly experienceListingRepository: Repository<ExperienceListingEntity>,
    @Inject(USER_LEGAL_CONSENT)
    private readonly userLegalConsentRepository: Repository<UserLegalConsent>,

  ) { }

  /**
   * Creates a new host record in the database.
   * @param createHostDto The DTO containing the host data.
   * @returns The created host entity.
   */
  async create(createHostDto: CreateHostDto, userId: string) {
    const hostExist = await this.hostRepository.findOne({
      where: {
        userId
      }
    })
    if (hostExist) {
      await this.hostRepository.update({
        id: hostExist.id
      }, {
        hostType: createHostDto.hostType
      })
    } else {
      const host = this.hostRepository.create(createHostDto);
      host.userId = userId;
      return this.hostRepository.save(host);
    }

  }

  async updateBasic(dto: UpdateBasicDto, userId: string) {
    const host = await this.hostRepository.findOne({
      where: {
        userId
      }
    })
    await this.basicRepository.delete({
      hostId: host.id
    })
    await this.contactRepository.delete({
      hostId: host.id
    })
    const basic = new HostBasicEntity()
    basic.hostId = host.id;
    basic.corporateName = dto.corporateName;
    basic.identificationNumber = dto.identificationNumber;
    basic.legalRepresentative = dto.legalRepresentative;
    basic.taxIdNumber = dto.taxIdNumber;
    basic.tradeName = dto.tradeName;

    await this.basicRepository.save(basic)

    const contacts: HostContactEntity[] = dto.contacts.map(item => {
      const contact = new HostContactEntity();
      contact.contactName = item.contactName;
      contact.contactType = item.contactType;
      contact.email = item.email;
      contact.phone = item.phone;
      contact.hostId = host.id;
      return contact;
    })

    await this.contactRepository.save(contacts)

    const consent = this.userLegalConsentRepository.create({
      userId,
      documentType: LegalDocumentType.DATA_POLICY,
      consentedAt: new Date().getTime().toString(),
      version: '1.0',
      ipAddress: "::1",
      consentText: `I accept the data processing policy *
I confirm that I have read and accept the processing of my personal data`
    })

    await this.userLegalConsentRepository.save(consent);
  }

  async updateTax(dto: UpdateTaxDto, userId: string) {
    const host = await this.hostRepository.findOne({
      where: {
        userId
      }
    })

    await this.taxRepository.delete({
      hostId: host.id
    })
    const tax = new HostTaxEntity()
    tax.hostId = host.id;
    tax.consumptionTax = dto.consumptionTax;
    tax.reteicaApply = dto.reteicaApply;
    tax.reteicaPercentage = dto.reteicaPercentage
    tax.reteivaApply = dto.reteivaApply
    tax.reteivaApply = dto.reteivaApply
    tax.simplifiedTaxRegime = dto.simplifiedTaxRegime
    tax.sourceWithholdingApply = dto.sourceWithholdingApply
    tax.sourceWithholdingPercentage = dto.sourceWithholdingPercentage
    tax.vatResponsible = dto.vatResponsible

    await this.taxRepository.save(tax);
  }

  async updateBank(dto: UpdateBankDto, userId: string) {
    const host = await this.hostRepository.findOne({
      where: {
        userId
      }
    })

    await this.bankRepository.delete({
      hostId: host.id
    })

    const bank = new HostBankEntity()
    bank.hostId = host.id;
    bank.accountHolder = dto.accountHolder;
    bank.accountNumber = dto.accountNumber;
    bank.accountType = dto.accountType;
    bank.idDocumentNumber = dto.idDocumentNumber;
    bank.idDocumentType = dto.idDocumentType;
    bank.bank = dto.bank;

    await this.bankRepository.save(bank)
  }

  async findOne(userId: string) {
    const host = await this.hostRepository.findOne({
      where: {
        userId
      },
      relations: {
        bank: true,
        basic: true,
        documents: true,
        contacts: true,
        tax: true,
        user: {
          legalConsents: true
        }
      }
    })

    return host;
  }

  async updateTerms(userId: string, dto: UpdateHostTerm) {

    const sf = await this.serviceFeeRepo.findOne({
      where: {
        serviceFee: ServiceFeeEnum.HOST_SERVICE_FEE
      }
    })

    

    await this.hostRepository.update({
      userId,
      contractAcceptanceTimestamp: IsNull(),
    }, {
      contractAcceptanceTimestamp: Date.now().toString(),
      serviceFee: sf?.fees || 0
    })

    const consent = this.userLegalConsentRepository.create({
      userId,
      documentType: LegalDocumentType.TERMS_OF_SERVICE,
      consentedAt: new Date().getTime().toString(),
      version: '1.0',
      ipAddress: "::1",
      consentText: `I have read and accept all contract terms*
Including commission policies, cancellation policies, and responsibilities`
    })

    await this.userLegalConsentRepository.save(consent);
  }

  async uploadDocument(userId: string, file: Express.Multer.File, type: HostDocumentType) {
    const host = await this.hostRepository.findOne({
      where: {
        userId
      }
    })
    const document = await this.documentRepository.findOne({
      where: {
        host: {
          userId
        },
        documentType: type
      },
      relations: {
        host: true
      }
    })

    if (document) {
      await this.documentRepository.delete({
        id: document.id
      })
    }

    if (file) {
      const userDocument = this.documentRepository.create({
        hostId: host.id,
        documentType: type,
        mimeType: file.mimetype,
        fileName: file.filename
      })

      await this.documentRepository.save(userDocument)
    }
  }

  async updateStatus(status: boolean, hostId: number) {
    await this.hostRepository.update({
      id: hostId
    }, {
      status: status ? "2" : "3"
    })
  }

  async findActiveHosts() {
    return await this.hostRepository.find({
      where: {
        status: "2"
      },
      relations: {
        user: {
          profile: true
        }
      }
    })
  }

  async updateHostServiceFee(userId: string, serviceFee: number) {
    const oldRate = await this.hostServiceRepository.findOne({
      where: {
        userId
      },
      order: { createdAt: "DESC" }
    })
    const hostServiceFee = this.hostServiceRepository.create({
      serviceFee,
      userId
    })

    await this.hostServiceRepository.save(hostServiceFee)

    const user = await this.userRepository.findOne({
      where: {
        id: userId
      },
      relations: {
        profile: true,
        host: true
      }
    })
  }

  async adminDashboard(startDate: number, endDate: number, userId: string) {
    const users = await this.userRepository.find({
      select: {
        id: true,
        createdAt: true
      },
      where: {
        createdAt: Between(new Date(startDate), new Date(endDate))
      },

    })

    const bookings = await this.experienceBookingRepository.findAndCount({
      relations: {
        payment: true,
        payout: true,
        refund: true
      },

      where: {
        userId,
        createdAt: Between(new Date(startDate), new Date(endDate)),
        payment: {
          paymentStatus: PaymentStatus.PAYMENT_COMPLETED
        }
      }
    })

    const properties = await this.experienceListingRepository.count({
      where: {
        createdAt: Between(new Date(startDate), new Date(endDate)),
        experienceStatus: {
          publishStatus: ExperiencePublishType.APPROVED
        },
        userId
      }
    })

    // Group listings by city (optional)
    const listingsByCity = await this.experienceListingRepository
      .createQueryBuilder('property')
      .select('property.step5', 'step5')
      .select('step5.city', 'city')
      .addSelect('COUNT(*)', 'count')
      .where('property.createdAt BETWEEN :start AND :end', { start: new Date(startDate), end: new Date(endDate) })
      .groupBy('city.cityName')
      .andWhere('property.userId = :userId', { userId })
      .getRawMany();

    const cityPieChartData = listingsByCity.map(item => ({
      id: item.city || 'Unknown',
      value: Number(item.count),
    }));


    return {
      bookings,
      users,
      properties,
      cityPieChartData
    }


  }


}
