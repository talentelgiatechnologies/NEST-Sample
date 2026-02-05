import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Booking } from "./Booking.entity";

export enum PaymentStatus {
    PAYMENT_INITIATED = 'PAYMENT_INITIATED',
    PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
    PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export enum PaymentType {
    PAYPAL = "PAYPAL",
    STRIPE = "STRIPE"
}

@Entity()
export class PaymentHistory {
    @PrimaryGeneratedColumn()
    id: string;

    @OneToOne(() => Booking, (booking) => booking.payment, { nullable: false })
    @JoinColumn({ name: 'bookingId' })
    booking: Booking;

    @Column('uuid')
    bookingId: string;

    @Column('varchar', { nullable: false })
    paymentId: string;

    @Column('varchar', { nullable: true })
    message: string;

    @Column({
        type: "enum",
        enum: PaymentStatus,
        default: PaymentStatus.PAYMENT_INITIATED
    })
    paymentStatus: PaymentStatus;

    @Column({
        type: "enum",
        enum: PaymentType,
        default: PaymentType.STRIPE
    })
    paymentType: PaymentType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}