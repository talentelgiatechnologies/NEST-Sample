import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExperienceBookingEntity } from "./ExperienceBooking.entity";

@Entity('experience_cancellation')
export class ExperienceCancellationEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @OneToOne(() => ExperienceBookingEntity, (booking) => booking.cancellation, { nullable: false })
    @JoinColumn({ name: 'bookingId' })
    booking: ExperienceBookingEntity;

    @Column('uuid')
    bookingId: string;

    @Column({ type: 'float', default: 0 })
    refund: number;

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