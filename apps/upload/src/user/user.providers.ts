import { DataSource } from "typeorm";
import { DATA_SOURCE, INBOX, USER, USER_DOCUMENT, USER_OTP, USER_SESSION } from "database/constants";
import { User } from "database/enitity/User.entity";
import { UserSession } from "database/enitity/UserSession.entity";
import { UserOTP } from "database/enitity/UserOTP.entity";
import { UserDocument } from "database/enitity/UserDocument.entity";
import { Inbox } from "database/enitity/Inbox.entity";

export const userProviders = [
    {
        provide: USER,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
        inject: [DATA_SOURCE],
    },
    {
        provide: USER_SESSION,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(UserSession),
        inject: [DATA_SOURCE],
    },
    {
        provide: USER_OTP,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(UserOTP),
        inject: [DATA_SOURCE],
    },
    {
        provide: USER_DOCUMENT,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(UserDocument),
        inject: [DATA_SOURCE],
    },
    {
        provide: INBOX,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Inbox),
        inject: [DATA_SOURCE],
    }
];