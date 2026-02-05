import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";
import { ExperienceCategoriesEntity } from "./ExperienceCategories.entity";
import { ExperienceSubCategoriesEntity } from "./ExperienceSubCategories.entity";
import { ExperienceStatusEntity } from "./ExperienceStatus.entity";
import { ExperienceListingStep2Entity } from "./ExperienceListingStep2.entity";
import { ExperienceImagesEntity } from "./ExperienceImages.entity";
import { ExperienceListingRulesEntity } from "./ExperienceListingRules.entity";
import { ExperienceListingStep3Entity } from "./ExperienceListingStep3.entity";
import { ExperienceDatesEntity } from "./ExperienceDates.entity";
import { ExperienceDayEntity } from "./ExperienceDay.entity";
import { ExperienceListingStep1Entity } from "./ExperienceListingStep1.entity";
import { ExperienceListingSocialLinkEntity } from "./ExperienceListingSocialLink.entity";
import { ExperienceActivitiesEntity } from "./ExperienceActivities.entity";
import { ExperienceListingStep5Entity } from "./ExperienceListingStep5.entity";
import { ExperienceStoreDayEntity } from "./ExperienceStoreDay.entity";
import { ExperienceFeaturesEntity } from "./ExperienceFeatures.entity";
import { ExperienceListingStep4Entity } from "./ExperienceListingStep4.entity";
import { ExperienceBookingEntity } from "./ExperienceBooking.entity";
import { ExperienceSpecialDayEntity } from "./ExperienceSpecialDay.entity";
import { ExperienceStoreSpecialDayEntity } from "./ExperienceStoreSpecialDay.entity";
import { ExperienceBulkDatesEntity } from "./ExperienceBulkDates.entity";
import { ExperienceSpecificDatesEntity } from "./ExperienceSpecificDates.entity";
import { ExperienceReviewEntity } from "./ExperienceReview.entity";
import { ExperienceDescriptionItems } from "./ExperienceDescriptionItems";
import { YesNo } from "./host/HostTax.entity";
import { WishListItems } from "./WishListItems.entity ";

@Entity('experience_listing')
export class ExperienceListingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.properties, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => ExperienceCategoriesEntity, (category) => category.experienceListings)
  @JoinColumn({ name: 'categoryId' })
  category: ExperienceCategoriesEntity;

  @Column()
  categoryId: number;

  @ManyToOne(() => ExperienceSubCategoriesEntity, (subCategory) => subCategory.experienceListings)
  @JoinColumn({ name: 'subCategoryId' })
  subCategory: ExperienceSubCategoriesEntity;

  @Column()
  subCategoryId: number;

  @Column({ type: 'smallint', default: 0 })
  recommended: number;

  @OneToOne(() => ExperienceStatusEntity, (status) => status.experience, { nullable: false })
  experienceStatus: ExperienceStatusEntity;

  @OneToOne(() => ExperienceListingStep2Entity, (step2) => step2.experience)
  step2: ExperienceListingStep2Entity;

  @OneToOne(() => ExperienceListingStep1Entity, (step1) => step1.experience)
  step1: ExperienceListingStep1Entity;

  @OneToOne(() => ExperienceListingStep3Entity, (step3) => step3.experience)
  step3: ExperienceListingStep3Entity;

  @OneToOne(() => ExperienceListingStep4Entity, (step3) => step3.experience)
  step4: ExperienceListingStep4Entity;

  @OneToOne(() => ExperienceListingStep5Entity, (step5) => step5.experience)
  step5: ExperienceListingStep5Entity;

  @OneToMany(() => ExperienceImagesEntity, images => images.experience)
  images: ExperienceImagesEntity[];

  @OneToMany(() => ExperienceListingSocialLinkEntity, socialLinks => socialLinks.experience)
  socialLinks: ExperienceListingSocialLinkEntity[];

  @OneToMany(() => ExperienceListingRulesEntity, rules => rules.experience)
  rules: ExperienceListingRulesEntity[];

  @OneToMany(() => ExperienceDatesEntity, dates => dates.experience)
  dates: ExperienceDatesEntity[];

  @OneToMany(() => ExperienceActivitiesEntity, activities => activities.experience)
  activities: ExperienceActivitiesEntity[];

  @OneToMany(() => ExperienceDayEntity, experienceDay => experienceDay.experience)
  experienceDays: ExperienceDayEntity[];

  @OneToMany(() => ExperienceSpecialDayEntity, experienceSpecialDays => experienceSpecialDays.experience)
  experienceSpecialDays: ExperienceSpecialDayEntity[];

  @OneToMany(() => ExperienceFeaturesEntity, features => features.experience)
  features: ExperienceFeaturesEntity[];

  @OneToMany(() => ExperienceStoreDayEntity, experienceStoreDay => experienceStoreDay.experience)
  experienceStoreDays: ExperienceStoreDayEntity[];

  @OneToMany(() => ExperienceStoreSpecialDayEntity, experienceStoreSpecialDays => experienceStoreSpecialDays.experience)
  experienceStoreSpecialDays: ExperienceStoreSpecialDayEntity[];

  @OneToMany(() => ExperienceBulkDatesEntity, experienceBulkDates => experienceBulkDates.experience)
  experienceBulkDates: ExperienceBulkDatesEntity[];

  @OneToMany(() => ExperienceSpecificDatesEntity, experienceSpecificDates => experienceSpecificDates.experience)
  experienceSpecificDates: ExperienceSpecificDatesEntity[];

  @OneToMany(() => ExperienceBookingEntity, (bookings) => bookings.experience)
  bookings: ExperienceBookingEntity[];

  @OneToMany(() => ExperienceReviewEntity, (review) => review.experience, { nullable: false })
  reviews: ExperienceReviewEntity[];

  @OneToMany(() => ExperienceDescriptionItems, (descriptionItems) => descriptionItems.experience)
  descriptionItems: ExperienceDescriptionItems[];

  @OneToMany(() => WishListItems, (wishListItems) => wishListItems.experience)
  wishListItems: WishListItems[];

  @Column({
    type: 'enum',
    enum: YesNo,
    default: YesNo.NO,
  })
  enabled: YesNo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}