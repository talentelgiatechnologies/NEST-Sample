import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Booking } from "./Booking.entity";

@Entity()
export class Cancellation {
    @PrimaryGeneratedColumn()
    id: string;

    @OneToOne(() => Booking, (booking) => booking.cancellation, { nullable: false })
    @JoinColumn({ name: 'bookingId' })
    booking: Booking;

    @Column('uuid')
    bookingId: string;

    @Column({ type: 'float', default: 0 })
    refund: number;

    @Column({ type: 'float', default: 0 })
    refundNights: number;

    @Column({ type: 'float', default: 0 })
    basePriceRefund: number;

    @Column({ type: 'float', default: 0 })
    serviceFeeRefund: number;

    @Column({ type: 'float', default: 0 })
    taxRefund: number;

    @Column({ type: 'float', default: 0 })
    cleaningFeeRefund: number;

    @Column({ type: 'float', default: 0 })
    payout: number;

    @Column('varchar', { nullable: false, default: "USD" })
    currency: string;

    @Column('varchar', { nullable: false })
    message: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}