import { DATA_SOURCE, EXPERIENCE_BOOKING, EXPERIENCE_LISTING, HOST, HOST_BANK, HOST_BASIC, HOST_CONTACT, HOST_DOCUMENT, HOST_SERVICE_FEE, HOST_TAX, SERVICE_FEE, USER, USER_LEGAL_CONSENT } from "database/constants";
import { DataSource } from "typeorm";

import { User } from "database/enitity/User.entity";
import { HostEntity } from "database/enitity/host/Host.entity";
import { HostBankEntity } from "database/enitity/host/HostBank.entity";
import { HostBasicEntity } from "database/enitity/host/HostBasic.entity";
import { HostContactEntity } from "database/enitity/host/HostContact.entity";
import { HostDocumentEntity } from "database/enitity/host/HostDocument.entity";
import { HostTaxEntity } from "database/enitity/host/HostTax.entity";
import { ServiceFee } from "database/enitity/ServiceFee.entity";
import { HostServiceFee } from "database/enitity/host/HostServiceFee.entity";
import { ExperienceBookingEntity } from "database/enitity/ExperienceBooking.entity";
import { ExperienceListingEntity } from "database/enitity/Experience.entity";
import { UserLegalConsent } from "database/enitity/UserLegalConsent";

export const hostProviders = [
    {
        provide: USER,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
        inject: [DATA_SOURCE],
    },
    {
        provide: HOST,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(HostEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: HOST_BANK,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(HostBankEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: HOST_BASIC,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(HostBasicEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: HOST_CONTACT,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(HostContactEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: HOST_DOCUMENT,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(HostDocumentEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: HOST_TAX,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(HostTaxEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: SERVICE_FEE,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ServiceFee),
        inject: [DATA_SOURCE],
    },
    {
        provide: HOST_SERVICE_FEE,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(HostServiceFee),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_BOOKING,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceBookingEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_LISTING,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceListingEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: USER_LEGAL_CONSENT,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(UserLegalConsent),
        inject: [DATA_SOURCE],
    }

];