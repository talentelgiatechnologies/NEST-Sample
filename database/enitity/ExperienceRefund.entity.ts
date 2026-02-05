import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExperienceBookingEntity } from "./ExperienceBooking.entity";

export enum RefundStatus {
    PENDING = "PENDING",
    HOLD = "HOLD",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

@Entity('experience_refund')
export class ExperienceRefundEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @OneToOne(() => ExperienceBookingEntity, (booking) => booking.refund, { nullable: false })
    @JoinColumn({ name: 'bookingId' })
    booking: ExperienceBookingEntity;

    @Column('uuid')
    bookingId: string;

    @Column({ type: 'float', default: 0 })
    refund: number;

    @Column({
        type: "enum",
        enum: RefundStatus,
        default: RefundStatus.PENDING
    })
    refundStatus: RefundStatus;

    @Column('varchar', { nullable: false, default: "USD" })
    currency: string;

    @Column('varchar', { nullable: true })
    message: string;

    @Column('int', { nullable: false, default: 1 })
    attempt: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}