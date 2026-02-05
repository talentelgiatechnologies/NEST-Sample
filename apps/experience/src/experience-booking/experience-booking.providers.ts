import { DataSource } from "typeorm";
import { COUPON_CODE_USAGE, CREDITS, DATA_SOURCE, EXPERIENCE_ACTIVITIES, EXPERIENCE_BOOKING, EXPERIENCE_BOOKING_HOST_PROPOSAL, EXPERIENCE_BULK_DATES, EXPERIENCE_BULK_DATES_SLOTS_ENTITY, EXPERIENCE_CANCELLATION, EXPERIENCE_CATEGORY, EXPERIENCE_DATES, EXPERIENCE_DAY, EXPERIENCE_DAY_SLOT, EXPERIENCE_FEATURES, EXPERIENCE_IMAGES, EXPERIENCE_LISTING, EXPERIENCE_LISTING_RULE, EXPERIENCE_OLD_BOOKING, EXPERIENCE_PAYMENT_HISTORY, EXPERIENCE_PAYOUT, EXPERIENCE_REFUND, EXPERIENCE_SLOT_BOOKINGS, EXPERIENCE_SOCIAL_LINKS, EXPERIENCE_SPECIFIC_DATES, EXPERIENCE_SPECIFIC_DATES_SLOTS_ENTITY, EXPERIENCE_STATUS, EXPERIENCE_STEP_1, EXPERIENCE_STEP_2, EXPERIENCE_STEP_3, EXPERIENCE_STEP_4, EXPERIENCE_STEP_5, EXPERIENCE_STORE_DAY, EXPERIENCE_STORE_DAY_SLOT, EXPERIENCE_SUB_CATEGORY, INBOX, MESSAGE } from "database/constants";
import { ExperienceCategoriesEntity } from "database/enitity/ExperienceCategories.entity";
import { ExperienceSubCategoriesEntity } from "database/enitity/ExperienceSubCategories.entity";
import { ExperienceListingEntity } from "database/enitity/Experience.entity";
import { ExperienceStatusEntity } from "database/enitity/ExperienceStatus.entity";
import { ExperienceImagesEntity } from "database/enitity/ExperienceImages.entity";
import { ExperienceListingStep2Entity } from "database/enitity/ExperienceListingStep2.entity";
import { ExperienceListingStep3Entity } from "database/enitity/ExperienceListingStep3.entity";
import { ExperienceDatesEntity } from "database/enitity/ExperienceDates.entity";
import { ExperienceListingRulesEntity } from "database/enitity/ExperienceListingRules.entity";
import { ExperienceDayEntity } from "database/enitity/ExperienceDay.entity";
import { ExperienceDaySlotsEntity } from "database/enitity/ExperienceDaySlots.entity";
import { ExperienceListingStep1Entity } from "database/enitity/ExperienceListingStep1.entity";
import { ExperienceListingSocialLinkEntity } from "database/enitity/ExperienceListingSocialLink.entity";
import { ExperienceActivitiesEntity } from "database/enitity/ExperienceActivities.entity";
import { ExperienceStoreDayEntity } from "database/enitity/ExperienceStoreDay.entity";
import { ExperienceListingStep5Entity } from "database/enitity/ExperienceListingStep5.entity";
import { ExperienceStoreDaySlotsEntity } from "database/enitity/ExperienceStoreDaySlots.entity";
import { ExperienceFeaturesEntity } from "database/enitity/ExperienceFeatures.entity";
import { ExperienceListingStep4Entity } from "database/enitity/ExperienceListingStep4.entity";
import { ExperiencePaymentHistoryEntity } from "database/enitity/ExperiencePaymentHistory.entity";
import { ExperienceBookingEntity } from "database/enitity/ExperienceBooking.entity";
import { Inbox } from "database/enitity/Inbox.entity";
import { Message } from "database/enitity/Message.entity";
import { ExperienceBookingHostProposalEntity } from "database/enitity/ExperienceBookingHostProposal.entity";
import { ExperienceOldBookingEntity } from "database/enitity/ExperienceOldBooking.entity";
import { ExperienceBulkDatesEntity } from "database/enitity/ExperienceBulkDates.entity";
import { ExperienceBulkDateSlotsEntity } from "database/enitity/ExperienceBulkDateSlots.entity";
import { ExperienceSpecificDatesEntity } from "database/enitity/ExperienceSpecificDates.entity";
import { ExperienceSpecificDateSlotsEntity } from "database/enitity/ExperienceSpecificDatesSlots.entity";
import { ExperienceCancellationEntity } from "database/enitity/ExperienceCancellation.entity";
import { ExperienceRefundEntity } from "database/enitity/ExperienceRefund.entity";
import { ExperiencePayoutEntity } from "database/enitity/ExperiencePayout.entity";
import { CouponCodeUsage } from "database/enitity/CouponCodeUsage.entity";
import { Credits } from "database/enitity/Credits.entity";
import { ExperienceSlotBookingsEntity } from "database/enitity/ExperienceSlotBookings.entity";

export const experienceBookingProviders = [
    {
        provide: EXPERIENCE_CATEGORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceCategoriesEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_SUB_CATEGORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceSubCategoriesEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_LISTING,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceListingEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_STATUS,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceStatusEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_IMAGES,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceImagesEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_STEP_2,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceListingStep2Entity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_STEP_3,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceListingStep3Entity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_STEP_4,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceListingStep4Entity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_STEP_1,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceListingStep1Entity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_DATES,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceDatesEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_LISTING_RULE,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceListingRulesEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_DAY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceDayEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_DAY_SLOT,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceDaySlotsEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_STORE_DAY_SLOT,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceStoreDaySlotsEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_SOCIAL_LINKS,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceListingSocialLinkEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_ACTIVITIES,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceActivitiesEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_STORE_DAY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceStoreDayEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_STEP_5,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceListingStep5Entity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_FEATURES,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceFeaturesEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_PAYMENT_HISTORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperiencePaymentHistoryEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_BOOKING,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceBookingEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_BOOKING_HOST_PROPOSAL,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceBookingHostProposalEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_OLD_BOOKING,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceOldBookingEntity),
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
        provide: EXPERIENCE_BULK_DATES,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceBulkDatesEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_BULK_DATES_SLOTS_ENTITY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceBulkDateSlotsEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_SPECIFIC_DATES,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceSpecificDatesEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_SPECIFIC_DATES_SLOTS_ENTITY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceSpecificDateSlotsEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_CANCELLATION,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceCancellationEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_REFUND,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceRefundEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: EXPERIENCE_PAYOUT,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperiencePayoutEntity),
        inject: [DATA_SOURCE],
    },
    {
        provide: COUPON_CODE_USAGE,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(CouponCodeUsage),
        inject: [DATA_SOURCE],
    },
    {
        provide: CREDITS,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Credits),
        inject: [DATA_SOURCE],
    },
     {
        provide: EXPERIENCE_SLOT_BOOKINGS,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExperienceSlotBookingsEntity),
        inject: [DATA_SOURCE],
    },



];