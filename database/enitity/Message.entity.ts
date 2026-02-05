import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Index,
    JoinColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Inbox } from './Inbox.entity';
import { Booking } from './Booking.entity';
import { Property } from './Property.entity';
import { ExperienceBookingEntity } from './ExperienceBooking.entity';

export enum MessageTypeEnum {
    MESSAGE = "MESSAGE",
    REQUESTED = "REQUESTED",
    NEW_BOOKING = "NEW_BOOKING",
    NEW_EXPERIENCE_BOOKING = "NEW_EXPERIENCE_BOOKING",
    EXPERIENCE_REQUESTED = "EXPERIENCE_REQUESTED",
    APPROVED = "APPROVED",
    EXPERIENCE_APPROVED = "EXPERIENCE_APPROVED",
    DECLINED = "DECLINED",
    EXPERIENCE_DECLINED = "EXPERIENCE_DECLINED",
    CANCELLEDBYUSER = "CANCELLEDBYUSER",
    CANCELLEDBYHOST = "CANCELLEDBYHOST",
    EXPIRED = "EXPIRED",
    EXPERIENCE_EXPIRED = "EXPERIENCE_EXPIRED",
    ENQUIRY = "ENQUIRY",
    ENQUIRY_DECLINED = "ENQUIRY_DECLINED",
    ENQUIRY_EXPIRED = "ENQUIRY_EXPIRED",
    PREAPPROVED = "PREAPPROVED",
    COMPLETED = "COMPLETED",
    SPECIAL_OFFER = "SPECIAL_OFFER",
    EXPERIENCE_HOST_REQUEST_EXPIRED = "EXPERIENCE_HOST_REQUEST_EXPIRED",
    EXPERIENCE_GUEST_REQUEST_EXPIRED = "EXPERIENCE_GUEST_REQUEST_EXPIRED",
    OFFER_GUEST_DECLINED = "EXPERIENCE_GUEST_DECLINED"
};

@Entity('message')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.messages, { nullable: false })
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @Column('uuid')
    senderId: string;

    @ManyToOne(() => Property, (property) => property.messages, { nullable: true })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @Column('uuid', { nullable: true })
    propertyId: string;

    @ManyToOne(() => Inbox, (inbox) => inbox.messages, { nullable: false })
    @JoinColumn({ name: 'inboxId' })
    inbox: Inbox;

    @Column('uuid')
    inboxId: string;

    @ManyToOne(() => Booking, (booking) => booking.messages, { nullable: true })
    @JoinColumn({ name: 'bookingId' })
    booking: Booking;

    @Column('uuid', { nullable: true })
    bookingId: string;

    @ManyToOne(() => ExperienceBookingEntity, (experienceBooking) => experienceBooking.messages, { nullable: true })
    @JoinColumn({ name: 'experienceBookingId' })
    experienceBooking: ExperienceBookingEntity;

    @Column('uuid', { nullable: true })
    experienceBookingId: string;

    @Column({ type: 'varchar', nullable: true })
    message: string;

    @Column({ type: 'timestamp', nullable: true })
    startDate: Date;

    @Column({ type: 'timestamp', nullable: true })
    endDate: Date;

    @Column({ type: 'float', nullable: true })
    startTime: number;

    @Column({ type: 'float', nullable: true })
    endTime: number;

    @Column({ type: 'int', nullable: true })
    guests: number;

    @Column({ type: "smallint", nullable: false, default: 0 })
    read: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({
        type: 'enum',
        enum: MessageTypeEnum,
        default: MessageTypeEnum.MESSAGE,
    })
    messageType: MessageTypeEnum;
}
