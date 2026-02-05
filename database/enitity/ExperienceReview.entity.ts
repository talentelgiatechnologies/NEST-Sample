// src/reviews/review.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User.entity';
import { ExperienceListingEntity } from './Experience.entity';
import { ExperienceBookingEntity } from './ExperienceBooking.entity';

export enum ReviewStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

@Entity('experience_review')
export class ExperienceReviewEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', width: 1 })
    rating: number; // typically 1–5

    @Column({ type: 'text', nullable: true })
    comment: string;

    @Column({ nullable: true })
    userId: string;

    @ManyToOne(() => User, user => user.reviewed)
    @JoinColumn({ name: 'userId' })
    user: User

    @Column()
    toUserId: string;

    @ManyToOne(() => User, user => user.reviews)
    @JoinColumn({ name: 'toUserId' })
    toUser: User

    @ManyToOne(() => ExperienceBookingEntity, (booking) => booking.reviews)
    @JoinColumn({ name: 'bookingId' })
    booking: ExperienceBookingEntity;

    @Column('uuid', { nullable: true })
    bookingId: string;

    @ManyToOne(() => ExperienceListingEntity, (experience) => experience.reviews, { nullable: false })
    @JoinColumn({ name: 'experienceId' })
    experience: ExperienceListingEntity;

    @Column('uuid')
    experienceId: string;

    @Column({
        type: 'enum',
        enum: ReviewStatus,
        default: ReviewStatus.PENDING
    })
    status: ReviewStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    parentReviewId: number;

    @OneToMany(() => ExperienceReviewEntity, replies => replies.review)
    replies: ExperienceReviewEntity[];

    @ManyToOne(() => ExperienceReviewEntity, (review) => review.replies)
    @JoinColumn({ name: 'parentReviewId' })
    review: ExperienceReviewEntity;
}
