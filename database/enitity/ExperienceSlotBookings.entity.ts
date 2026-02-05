import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExperienceBulkDateSlotsEntity } from "./ExperienceBulkDateSlots.entity";
import { ExperienceSpecificDateSlotsEntity } from "./ExperienceSpecificDatesSlots.entity";
import { ExperienceBookingEntity } from "./ExperienceBooking.entity";

@Entity('experience_slot_bookings')
export class ExperienceSlotBookingsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int')
    experienceBookingId: number;

    @OneToOne(() => ExperienceBookingEntity, experienceBooking => experienceBooking.slotBooking)
    @JoinColumn({ name: 'experienceBookingId' })
    experienceBooking: ExperienceBookingEntity;

    @Column('int', { nullable: true })
    bulkSlotId: number;

    @ManyToOne(() => ExperienceBulkDateSlotsEntity, bulkDateSlot => bulkDateSlot.experienceSlotBookings)
    @JoinColumn({ name: 'bulkSlotId' })
    bulkDateSlot: ExperienceBulkDateSlotsEntity;

    @Column('int', { nullable: true })
    specificSlotId: number;

    @ManyToOne(() => ExperienceSpecificDateSlotsEntity, specificDateSlot => specificDateSlot.experienceSlotBookings)
    @JoinColumn({ name: 'specificSlotId' })
    specificDateSlot: ExperienceSpecificDateSlotsEntity;

    @Column('int')
    guests: number;
}