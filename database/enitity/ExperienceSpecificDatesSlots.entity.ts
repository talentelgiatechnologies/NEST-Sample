import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExperienceSpecificDatesEntity } from "./ExperienceSpecificDates.entity";
import { ExperienceBookingEntity } from "./ExperienceBooking.entity";
import { ExperienceSlotBookingsEntity } from "./ExperienceSlotBookings.entity";

export enum ExperienceBookingTypeEnum {
    REQUEST = 'request',
    INSTANT = 'instant',
}

export enum SlotAvailability {
    BLOCKED = "0",
    OPEN = "1",
    BOOKED = "2"
}

@Entity('experience_specific_dates_slot')
export class ExperienceSpecificDateSlotsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceSpecificDatesEntity, experienceSpecificDate => experienceSpecificDate.experienceSpecificDatesSlots)
    @JoinColumn({ name: 'experienceSpecificDateId' })
    experienceSpecificDate: ExperienceSpecificDatesEntity

    @Column()
    experienceSpecificDateId: number;

    @Column({
        type: 'float'
    })
    fhour: number;

    @Column({
        type: 'float'
    })
    thour: number;

    @Column({
        enum: ExperienceBookingTypeEnum,
        type: 'enum',
        default: ExperienceBookingTypeEnum.INSTANT
    })
    experienceBookingType: ExperienceBookingTypeEnum;

    @Column({
        enum: SlotAvailability,
        type: 'enum',
        nullable: true
    })
    slotAvailablity: SlotAvailability;

    @Column('int')
    minSeat: number;

    @Column('float', { nullable: true })
    specialPrice: number;

    @Column('int')
    maxSeat: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => ExperienceSlotBookingsEntity, experienceSlotBooking => experienceSlotBooking.specificDateSlot)
    experienceSlotBookings: ExperienceSlotBookingsEntity[];
}