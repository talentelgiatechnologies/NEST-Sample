import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Booking } from "./Booking.entity";

export enum RefundStatus {
    PENDING = "PENDING",
    HOLD = "HOLD",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

@Entity()
export class Refund {
    @PrimaryGeneratedColumn()
    id: string;

    @OneToOne(() => Booking, (booking) => booking.refund, { nullable: false })
    @JoinColumn({ name: 'bookingId' })
    booking: Booking;

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