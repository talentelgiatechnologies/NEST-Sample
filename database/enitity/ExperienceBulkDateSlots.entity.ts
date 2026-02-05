import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExperienceBulkDatesEntity } from "./ExperienceBulkDates.entity";
import { ExperienceSlotBookingsEntity } from "./ExperienceSlotBookings.entity";

export enum ExperienceBookingTypeEnum {
    REQUEST = 'request',
    INSTANT = 'instant',
}

@Entity('experience_bulk_dates_slot')
export class ExperienceBulkDateSlotsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceBulkDatesEntity, experienceBulk => experienceBulk.experienceBulkSlots)
    @JoinColumn({ name: 'experienceBulkId' })
    experienceBulk: ExperienceBulkDatesEntity

    @Column()
    experienceBulkId: number;

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

    @Column('float', { nullable: true })
    specialPrice: number;

    @Column('int')
    minSeat: number;

    @Column('int')
    maxSeat: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => ExperienceSlotBookingsEntity, experienceSlotBooking => experienceSlotBooking.bulkDateSlot)
    experienceSlotBookings: ExperienceSlotBookingsEntity[];
}