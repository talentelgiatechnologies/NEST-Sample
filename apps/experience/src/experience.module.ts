import { Module } from '@nestjs/common';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';
import { ConfigModule } from '@nestjs/config';
import { ListingModule } from './listing/listing.module';
import { CategoryModule } from './category/category.module';
import { DatabaseModule } from 'database/database.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { ExperienceListingModule } from './experience-listing/experience-listing.module';
import { ExperienceRulesModule } from './experience-rules/experience-rules.module';
import { ExperienceBookingModule } from './experience-booking/experience-booking.module';
import { MessageModule } from './message/message.module';
import { ExperienceReviewModule } from './experience-review/experience-review.module';
import { PayoutModule } from './payout/payout.module';
import { DisputeModule } from './dispute/dispute.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local', '.env.development'],
      isGlobal: true
    }),
    ListingModule,
    CategoryModule,
    DatabaseModule,
    SubCategoryModule,
    ExperienceListingModule,
    ExperienceRulesModule,
    ExperienceBookingModule,
    MessageModule,
    ExperienceReviewModule,
    PayoutModule,
    DisputeModule,
  ],
  controllers: [ExperienceController],
  providers: [ExperienceService],
})
export class ExperienceModule { }
