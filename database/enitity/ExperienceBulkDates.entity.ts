import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExperienceListingEntity } from "./Experience.entity";
import { ExperienceBulkDateSlotsEntity } from "./ExperienceBulkDateSlots.entity";
import { ExperienceType } from "./ExperienceBookingHostProposal.entity";

export enum ExperienceDayOpenEnum {
    OPEN = 1,
    CLOSED = 0
}

export enum ExperienceWholeDayEnum {
    WHOLE_DAY = 1,
    NOT_WHOLE_DAY = 0
}

@Entity('experience_bulk_dates')
export class ExperienceBulkDatesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceListingEntity, experience => experience.experienceBulkDates)
    @JoinColumn({ name: 'experienceId' })
    experience: ExperienceListingEntity

    @Column()
    experienceId: string;

    @Column({
        type: 'smallint'
    })
    day: number;

    @Column({
        type: 'date',
        nullable: true
    })
    startDate: Date;

    @Column({
        type: 'date',
        nullable: true
    })
    endDate: Date;

    @Column({
        type: 'float',
        nullable: true
    })
    repeatWeeks: number;

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

    

    @OneToMany(() => ExperienceBulkDateSlotsEntity, experienceBulkSlots => experienceBulkSlots.experienceBulk)
    experienceBulkSlots: ExperienceBulkDateSlotsEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}