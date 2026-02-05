import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User.entity';
import { Property } from './Property.entity';
import { Message } from './Message.entity';
import { Cancellation } from './Cancellation.entity';
import { Refund } from './Refund.entity';
import { Payout } from './Payout.entity';
import { Review } from './Review.entity';
import { PaymentHistory } from './PaymentHistory.entity';

export enum BookingStatus {
  PENDING = 'PENDING',
  PAYMENT_INITIATED = 'PAYMENT_INITIATED',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
  DECLINED = 'DECLINED',
  CANCELLEDBYUSER = 'CANCELLEDBYUSER',
  CANCELLEDBYHOST = 'CANCELLEDBYHOST',
  EXPIRED = 'EXPIRED'
}

export enum BookingRemainderEnum {
  SENT = 1,
  NOT_SENT = 0
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.bookings, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => Property, (property) => property.bookings, { nullable: false })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column('uuid')
  propertyId: string;

  @Column('float')
  basePrice: number;

  @Column('float')
  avgBasePrice: number;

  @Column('float')
  cleaningFee: number;

  @Column('float')
  nights: number;

  @Column('float')
  tax: number;

  @Column({ type: 'float', default: 0 })
  serviceFee: number;

  @Column({ type: 'float', default: 0 })
  hostServiceFee: number;

  @Column('float')
  total: number;

  @Column('float')
  discount: number;

  @Column({type: 'date', nullable: false})
  startDate: Date;

  @Column({type: 'date', nullable: false})
  endDate: Date;

  @Column('varchar', { nullable: false, default: "USD" })
  currency: string;

  @Column('int', { nullable: false, default: 1 })
  cancellationId: number;

  @Column('int', { nullable: false, default: 1 })
  guests: number;

  @OneToMany(() => Message, (message) => message.booking)
  messages: Message[];

  @Column({
    type: "enum",
    enum: BookingStatus,
    default: BookingStatus.PENDING
  })
  bookingStatus: BookingStatus;

  @Column({
    type: "enum",
    enum: BookingRemainderEnum,
    default: BookingRemainderEnum.NOT_SENT
  })
  bookingRemainder: BookingRemainderEnum;

  @OneToOne(() => Cancellation, (cancellation) => cancellation.booking)
  cancellation: Cancellation;

  @OneToOne(() => PaymentHistory, (payment) => payment.booking)
  payment: PaymentHistory;

  @OneToOne(() => Refund, (refund) => refund.booking)
  refund: Refund;

  @OneToOne(() => Payout, (payout) => payout.booking)
  payout: Payout;

  @OneToMany(() => Review, (review) => review.booking)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
