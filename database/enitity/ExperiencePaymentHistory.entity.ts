import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExperienceBookingEntity } from "./ExperienceBooking.entity";

export enum PaymentStatus {
    PAYMENT_INITIATED = 'PAYMENT_INITIATED',
    PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
    PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export enum PaymentType {
    SIIGO = "SIIGO"
}

@Entity('experience_payment_history_entity')
export class ExperiencePaymentHistoryEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @OneToOne(() => ExperienceBookingEntity, (booking) => booking.payment, { nullable: false })
    @JoinColumn({ name: 'bookingId' })
    booking: ExperienceBookingEntity;

    @Column('int', { nullable: false })
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
        default: PaymentType.SIIGO
    })
    paymentType: PaymentType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}