// src/reviews/review.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Booking } from './Booking.entity';
import { Property } from './Property.entity';

@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', width: 1 })
    rating: number; // typically 1–5

    @Column({ type: 'text', nullable: true })
    comment: string;

    @ManyToOne(() => Booking, (booking) => booking.reviews, { nullable: false })
    @JoinColumn({ name: 'bookingId' })
    booking: Booking;

    @Column('uuid')
    bookingId: string;

    @ManyToOne(() => Property, (property) => property.reviews, { nullable: false })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @Column('uuid')
    propertyId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
