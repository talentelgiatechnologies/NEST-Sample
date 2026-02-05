import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, OneToOne } from "typeorm";
import { UserSession } from "./UserSession.entity";
import { UserOTP } from "./UserOTP.entity";
import { Property } from "./Property.entity";
import { Booking } from "./Booking.entity";
import { Inbox } from "./Inbox.entity";
import { Message } from "./Message.entity";
import { PropertyView } from "./PropertyView.entity";
import { UserDocument } from "./UserDocument.entity";
import { PayoutAccount } from "./PayoutAccount.entity";
import { WishList } from "./WishList.entity";
import { Expose } from "class-transformer";
import { config } from "../../lib/config";
import { ForgotPassword } from "./ForgotPassword.entity";
import { EmailVerifyToken } from "./EmailVerifyToken";
import { UserProfile } from "./UserProfile.entity";
import { Report } from "./Report.entity";
import { ExperienceListingEntity } from "./Experience.entity";
import { ExperienceBookingEntity } from "./ExperienceBooking.entity";
import { CouponCode } from "./CouponCode.entity";
import { HostEntity } from "./host/Host.entity";
import { HostServiceFee } from "./host/HostServiceFee.entity";
import { ExperienceReviewEntity } from "./ExperienceReview.entity";
import { CouponCodeUsage } from "./CouponCodeUsage.entity";
import { Credits } from "./Credits.entity";
import { DisputeEntity } from "./Disputes.entity";
import { UserLegalConsent } from "./UserLegalConsent";
import { UserEmailOTP } from "./UserEmailOTP.entity";

export enum DocumentStatus {
  APPROVED = "APPROVED",
  DECLINED = "DECLINED",
  PENDING = "PENDING"
}

export enum UserType {
  GUEST = "1",
  HOST = "2"
}

export enum AUTH_PROVIDER_TYPE {
  GOOGLE = "1",
  FACEBOOK = "2"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Expose()
  get profilePictureWithUrl(): string {
    const baseUrl = config().PROFILE_PATH;
    return this.profilePicture ? baseUrl + this.profilePicture : null;
  }

  @Column({
    nullable: true
  })
  password: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'smallint', default: 0 })
  emailVerified: number;

  @Column({ type: 'smallint', default: 0 })
  phoneVerified: number;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  dialCode?: string;

  @Column({ nullable: true })
  googleProviderId: string;

  @Column({ nullable: true })
  fbProviderId: string;

  @Column({
    enum: UserType,
    type: 'enum',
    default: UserType.GUEST
  })
  userType: UserType;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ nullable: true })
  bannedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING
  })
  documentStatus: DocumentStatus;

  @Column('varchar', { nullable: true })
  documentReason: string;

  @OneToMany(() => UserSession, (session) => session.user)
  sessions: UserSession[];

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @OneToMany(() => Report, (report) => report.reporter)
  reported: Report[];

  @OneToMany(() => Property, (property) => property.user)
  properties: Property[];

  @OneToMany(() => ExperienceListingEntity, (experienceListings) => experienceListings.user)
  experienceListings: ExperienceListingEntity[];

  @OneToMany(() => WishList, (WishList) => WishList.user)
  wishLists: WishList[];

  @OneToMany(() => Inbox, (inbox) => inbox.guest)
  guestInboxes: Inbox[];

  @OneToMany(() => Inbox, (inbox) => inbox.host)
  hostInboxes: Inbox[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => ExperienceBookingEntity, (experienceBookings) => experienceBookings.user)
  experienceBookings: ExperienceBookingEntity[];

  @OneToOne(() => UserOTP, (otp) => otp.user)
  otps: UserOTP;

  @OneToOne(() => UserEmailOTP, (emailOtp) => emailOtp.user)
  emailOtp: UserEmailOTP;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;

  @OneToMany(() => PropertyView, (view) => view.user, { nullable: false })
  propertyViews: PropertyView[];

  @OneToMany(() => UserDocument, (document) => document.user, { nullable: false })
  documents: UserDocument[];

  @OneToMany(() => PayoutAccount, (payout) => payout.user)
  payouts: PayoutAccount[];

  @OneToOne(() => ForgotPassword, forgotPassword => forgotPassword.user)
  forgotPassword: ForgotPassword;

  @OneToOne(() => EmailVerifyToken, emailVerifyToken => emailVerifyToken.user)
  emailVerifyToken: EmailVerifyToken;

  @OneToMany(() => CouponCode, (coupons) => coupons.user)
  coupons: CouponCode[];

  @OneToOne(() => HostEntity, host => host.user)
  host: HostEntity;

  @OneToMany(() => HostServiceFee, serviceFee => serviceFee.user)
  serviceFee: HostServiceFee[];

  @OneToMany(() => ExperienceReviewEntity, (reviews) => reviews.toUser)
  reviews: ExperienceReviewEntity[]

  @OneToMany(() => ExperienceReviewEntity, (reviews) => reviews.user)
  reviewed: ExperienceReviewEntity[]

  @OneToMany(() => CouponCodeUsage, (usage) => usage.user)
  couponsUsed: CouponCodeUsage[];

  @OneToMany(() => Credits, (credits) => credits.user)
  credits: Credits[];

  @OneToMany(()=> DisputeEntity, (disputes) => disputes.claimer)
  disputesClaimed: DisputeEntity[];

  @OneToMany(()=> DisputeEntity, (disputes) => disputes.claimee)
  disputesReceived: DisputeEntity[];

  @OneToMany(() => UserLegalConsent, (consent) => consent.user)
  legalConsents: UserLegalConsent[];
}
