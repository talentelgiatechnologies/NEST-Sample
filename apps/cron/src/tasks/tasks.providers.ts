import { BOOKINGS, DATA_SOURCE, EXPERIENCE_BOOKING, EXPERIENCE_PAYOUT, INBOX, MESSAGE, PAYMENT_HISTORY, PAYOUT } from "database/constants";
import { Booking } from "database/enitity/Booking.entity";
import { ExperienceBookingEntity } from "database/enitity/ExperienceBooking.entity";
import { ExperiencePayoutEntity } from "database/enitity/ExperiencePayout.entity";
import { Inbox } from "database/enitity/Inbox.entity";
import { Message } from "database/enitity/Message.entity";
import { PaymentHistory } from "database/enitity/PaymentHistory.entity";
import { Payout } from "database/enitity/Payout.entity";
import { DataSource } from "typeorm";

export const taskProviders = [
    {
        provide: BOOKINGS,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Booking),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_BOOKING,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceBookingEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: PAYMENT_HISTORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(PaymentHistory),
        inject: [DATA_SOURCE],
    },
    {
        provide: INBOX,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Inbox),
        inject: [DATA_SOURCE],
    },
    {
        provide: MESSAGE,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Message),
        inject: [DATA_SOURCE],
    },
    {
        provide: PAYOUT,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Payout),
        inject: [DATA_SOURCE],
    },
     {
        provide: EXPERIENCE_PAYOUT,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperiencePayoutEntity),
        inject: [DATA_SOURCE],
    },
]