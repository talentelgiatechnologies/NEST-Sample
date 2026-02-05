import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PayoutAccount } from "./PayoutAccount.entity";
import { ExperienceBookingEntity } from "./ExperienceBooking.entity";
import { YesNo } from "./host/HostTax.entity";

export enum PayoutStatus {
    PENDING = "PENDING",
    HOLD = "HOLD",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

export enum WOMPI_STATUS {
    PENDING_APPROVAL = "PENDING_APPROVAL",
    PENDING = "PENDING",
    NOT_APPROVED = "NOT_APPROVED",
    REJECTED = "REJECTED",
    PARTIAL_PAYMENT = "PARTIAL_PAYMENT",
    TOTAL_PAYMENT = "TOTAL_PAYMENT",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED",
}

@Entity('experience_payout')
export class ExperiencePayoutEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @OneToOne(() => ExperienceBookingEntity, (booking) => booking.payout, { nullable: false })
    @JoinColumn({ name: 'bookingId' })
    booking: ExperienceBookingEntity;

    @Column('uuid')
    bookingId: string;

    @ManyToOne(() => PayoutAccount, (payoutAccount) => payoutAccount.payout, { nullable: true })
    @JoinColumn({ name: 'payoutAccountId' })
    payoutAccount: PayoutAccount;

    @Column({ type: 'int', nullable: true })
    payoutAccountId: number;

    @Column({ type: 'float', default: 0 })
    payout: number;

    @Column({
        type: "enum",
        enum: PayoutStatus,
        default: PayoutStatus.PENDING
    })
    payoutStatus: PayoutStatus;

    @Column({
        type: 'enum',
        enum: YesNo,
        default: YesNo.NO
    })
    isHold: YesNo;

    @Column('varchar', { nullable: false, default: "USD" })
    currency: string;

    @Column('varchar', { nullable: true })
    message: string;

    @Column('int', { nullable: false, default: 0 })
    attempt: string;

    @Column('varchar', { nullable: true })
    documentName: string;

    @Column({
        type: 'enum',
        enum: YesNo,
        nullable: true
    })
    documentApproved: YesNo;

    @Column({
        type: "enum",
        enum: WOMPI_STATUS,
        nullable: true
    })
    wompStatus: WOMPI_STATUS;

    @Column('varchar', { nullable: true })
    wompiId: string;

    @Column('varchar', { nullable: true })
    wompiCode: string;

    @Column('date', { nullable: true })
    expectedDate: Date;

    @Column('text', { nullable: true })
    failureReason: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}