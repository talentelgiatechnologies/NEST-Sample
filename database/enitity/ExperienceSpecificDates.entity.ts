import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExperienceListingEntity } from "./Experience.entity";
import { ExperienceType } from "./ExperienceBookingHostProposal.entity";
import { ExperienceSpecificDateSlotsEntity } from "./ExperienceSpecificDatesSlots.entity";

export enum ExperienceDayOpenEnum {
    OPEN = 1,
    CLOSED = 0
}

export enum ExperienceWholeDayEnum {
    WHOLE_DAY = 1,
    NOT_WHOLE_DAY = 0
}

@Entity('experience_specific_dates')
export class ExperienceSpecificDatesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceListingEntity, experience => experience.experienceSpecificDates)
    @JoinColumn({ name: 'experienceId' })
    experience: ExperienceListingEntity

    @Column()
    experienceId: string;

    @Column({
        type: 'date',
        nullable: true
    })
    date: string;

    @Column({
        type: 'enum',
        enum: ExperienceWholeDayEnum,
    })
    experienceWholeDay: ExperienceWholeDayEnum;

    @Column({
        type: 'enum',
        enum: ExperienceDayOpenEnum
    })
    experienceDayOpen: ExperienceDayOpenEnum;

    @Column({
        type: 'enum',
        enum: ExperienceType,
    })
    experienceType: ExperienceType;

    @Column({
        type: 'boolean',
        default: false
    })
    indefinitely: boolean;

    @OneToMany(() => ExperienceSpecificDateSlotsEntity, experienceSpecificDatesSlots => experienceSpecificDatesSlots.experienceSpecificDate)
    experienceSpecificDatesSlots: ExperienceSpecificDateSlotsEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}