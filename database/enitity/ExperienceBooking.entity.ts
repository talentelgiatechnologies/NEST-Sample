import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User.entity';
import { Message } from './Message.entity';
import { ExperienceListingEntity } from './Experience.entity';
import { ExperienceBookingTypeEnum } from './ExperienceDaySlots.entity';
import { ExperiencePaymentHistoryEntity } from './ExperiencePaymentHistory.entity';
import { ExperienceBookingHostProposalEntity } from './ExperienceBookingHostProposal.entity';
import { ExperienceOldBookingEntity } from './ExperienceOldBooking.entity';
import { ExperienceSpecificDateSlotsEntity } from './ExperienceSpecificDatesSlots.entity';
import { YesNo } from './host/HostTax.entity';
import { ExperienceReviewEntity } from './ExperienceReview.entity';
import { ExperiencePayoutEntity } from './ExperiencePayout.entity';
import { ExperienceRefundEntity } from './ExperienceRefund.entity';
import { ExperienceCancellationEntity } from './ExperienceCancellation.entity';
import { CouponCodeUsage } from './CouponCodeUsage.entity';
import { Credits } from './Credits.entity';
import { COUPON_CODE_TYPE_ENUM } from './CouponCode.entity';
import { DisputeEntity } from './Disputes.entity';
import { ExperienceSlotBookingsEntity } from './ExperienceSlotBookings.entity';

export enum ExperienceBookingStatus {
  PENDING = 'PENDING',
  PAYMENT_INITIATED = 'PAYMENT_INITIATED',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  DECLINED = 'DECLINED',
  CANCELLEDBYUSER = 'CANCELLEDBYUSER',
  CANCELLEDBYHOST = 'CANCELLEDBYHOST',
  EXPIRED = 'EXPIRED',
  HOST_REQUEST_EXPIRED = 'HOST_REQUEST_EXPIRED',
  GUEST_REQUEST_EXPIRED = 'GUEST_REQUEST_EXPIRED',
  OFFER_GUEST_DECLINED = "EXPERIENCE_GUEST_DECLINED"
}

export enum ExperienceBookingRemainderEnum {
  SENT = '1',
  NOT_SENT = '0',
}

export enum ExperienceType {
  PRIVATE = '1',
  PUBLIC = '2',
}

@Entity('experience_booking')
export class ExperienceBookingEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.experienceBookings, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => ExperienceListingEntity, (experience) => experience.bookings, { nullable: false })
  @JoinColumn({ name: 'experienceId' })
  experience: ExperienceListingEntity;

  @Column('uuid')
  experienceId: string;

  @Column('float')
  basePrice: number;

  @Column('float')
  avgBasePrice: number;

  @Column('float')
  cleaningFee: number;

  @Column('float')
  tax: number;

  @Column({ type: 'float', default: 0 })
  serviceFee: number;

  @Column({ type: 'float', default: 0 })
  hostServiceFee: number;

  @Column('float')
  total: number;

  @Column('float')
  discountedTotal: number;

  @Column('float')
  discount: number;

  @Column({
    type: 'enum',
    enum: COUPON_CODE_TYPE_ENUM,
    default: COUPON_CODE_TYPE_ENUM.FIXED
  })
  discountType: COUPON_CODE_TYPE_ENUM;

  @Column('float', { nullable: true })
  creditsAppliedTotal: number;

  @Column('float', { nullable: true })
  creditsApplied: number;

  @Column({
    type: 'enum',
    enum: YesNo,
    default: YesNo.NO
  })
  vatResponsible: YesNo;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'float', nullable: false })
  startTime: number;

  @Column({ type: 'float', nullable: false })
  endTime: number;

  @Column('varchar', { nullable: false, default: 'USD' })
  currency: string;

  @Column('int', { nullable: false, default: 1 })
  cancellationId: number;

  @Column('int', { nullable: false, default: 1 })
  guests: number;

  @OneToMany(() => Message, (message) => message.experienceBooking)
  messages: Message[];

  @Column({
    type: 'enum',
    enum: ExperienceBookingStatus,
    default: ExperienceBookingStatus.PENDING,
  })
  bookingStatus: ExperienceBookingStatus;

  @Column()
  cancellationPolicy: string;

  @Column({
    type: 'enum',
    enum: ExperienceBookingRemainderEnum,
    default: ExperienceBookingRemainderEnum.NOT_SENT,
  })
  bookingRemainder: ExperienceBookingRemainderEnum;

  @Column({
    type: 'enum',
    enum: ExperienceType,
  })
  experienceType: ExperienceType;

  @Column({
    type: 'enum',
    enum: ExperienceBookingTypeEnum,
  })
  bookingType: ExperienceBookingTypeEnum;

  @Column('varchar', { nullable: true })
  companyName: string;

  @Column('varchar', { nullable: true })
  companyNIT: string;

  @Column('varchar', { nullable: true })
  companyEmail: string;

  @Column('varchar', { nullable: true })
  companyPhone: string;

  @OneToOne(() => ExperiencePaymentHistoryEntity, (payment) => payment.booking)
  payment: ExperiencePaymentHistoryEntity;

  @OneToOne(() => ExperienceBookingHostProposalEntity, (hostProposal) => hostProposal.experienceBooking)
  hostProposal: ExperienceBookingHostProposalEntity;

  @OneToOne(() => ExperienceOldBookingEntity, (oldBooking) => oldBooking.experienceBooking)
  oldBooking: ExperienceOldBookingEntity;

  @OneToMany(() => ExperienceReviewEntity, (reviews) => reviews.booking)
  reviews: ExperienceReviewEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => ExperiencePayoutEntity, (payout) => payout.booking)
  payout: ExperiencePayoutEntity;

  @OneToOne(() => ExperienceRefundEntity, (refund) => refund.booking)
  refund: ExperienceRefundEntity;

  @OneToOne(() => ExperienceCancellationEntity, (cancellation) => cancellation.booking)
  cancellation: ExperienceCancellationEntity;

  @OneToOne(()=> CouponCodeUsage, (coupon) => coupon.booking)
  coupon: CouponCodeUsage;

  @OneToMany(() => Credits, (credits) => credits.booking)
  balanceCredit: Credits;

  @OneToMany(() => Credits, (credits) => credits.usedBooking)
  usedCredit: Credits;

  @OneToOne(() => DisputeEntity, (dispute) => dispute.booking)
  dispute: DisputeEntity;

  @OneToOne(() => ExperienceSlotBookingsEntity, (slotBooking) => slotBooking.experienceBooking)
  slotBooking: ExperienceSlotBookingsEntity;

}
