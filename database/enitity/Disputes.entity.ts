import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExperienceBookingEntity } from "./ExperienceBooking.entity";
import { DisputesChatEntity } from "./DisputesChat.entity";
import { User } from "./User.entity";

export enum DisputeStatus {
    PENDING = 'pending',
    RESOLVED = 'resolved',
    REJECTED = 'rejected'
}

@Entity('disputes')
export class DisputeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    bookingId: string;

    @OneToOne(() => ExperienceBookingEntity, booking => booking.dispute)
    @JoinColumn({ name: 'bookingId' })
    booking: ExperienceBookingEntity;

    @Column({ nullable: false })
    claimedBy: string;

    @ManyToOne(() => User, user => user.disputesClaimed)
    @JoinColumn({ name: 'claimedBy' })
    claimer: User;

    @Column({ nullable: true })
    claimTo: string;

    @ManyToOne(() => User, user => user.disputesReceived)
    @JoinColumn({ name: 'claimTo' })
    claimee: User;

    @Column({ type: 'enum', enum: DisputeStatus, default: DisputeStatus.PENDING })
    status: DisputeStatus;

    @Column({
        type: 'timestamp',
        nullable: true
    })
    invitedAt: Date;

    @Column({
        type: 'timestamp',
        nullable: true
    })
    resolvedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => DisputesChatEntity, chat => chat.dispute)
    chats: DisputesChatEntity[];
}