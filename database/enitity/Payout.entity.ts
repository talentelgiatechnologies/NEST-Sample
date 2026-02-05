import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Booking } from "./Booking.entity";
import { PayoutAccount } from "./PayoutAccount.entity";

export enum PayoutStatus {
    PENDING = "PENDING",
    HOLD = "HOLD",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

@Entity()
export class Payout {
    @PrimaryGeneratedColumn()
    id: string;

    @OneToOne(() => Booking, (booking) => booking.payout, { nullable: false })
    @JoinColumn({ name: 'bookingId' })
    booking: Booking;

    @Column('uuid')
    bookingId: string;

    @ManyToOne(() => PayoutAccount, (payoutAccount) => payoutAccount.payout, { nullable: true })
    @JoinColumn({ name: 'payoutAccountId' })
    payoutAccount: PayoutAccount;

    @Column({ type: 'int', nullable: true })
    payoutAccountId: number;

    @Column({ type: 'float', default: 0 })
    payout: number;

    @Column({ type: 'float', default: 0 })
    serviceFee: number;

    @Column({
        type: "enum",
        enum: PayoutStatus,
        default: PayoutStatus.PENDING
    })
    payoutStatus: PayoutStatus;

    @Column('varchar', { nullable: false, default: "USD" })
    currency: string;

    @Column('varchar', { nullable: true })
    message: string;

    @Column('int', { nullable: false, default: 0 })
    attempt: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}