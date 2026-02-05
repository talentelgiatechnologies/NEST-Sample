import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExperienceListingEntity } from "./Experience.entity";
import { ExperienceDaySlotsEntity } from "./ExperienceDaySlots.entity";

export enum ExperienceDayEnum {
    SUNDAY = 1,
    MONDAY = 2,
    TUESDAY = 3,
    WEDNESDAY = 4,
    THURSDAY = 5,
    FRIDAY = 6,
    SATURDAY = 7
}

export enum ExperienceDayOpenEnum {
    OPEN = 1,
    CLOSED = 0
}

export enum ExperienceWholeDayEnum {
    WHOLE_DAY = 1,
    NOT_WHOLE_DAY = 0
}

@Entity('experience_day')
export class ExperienceDayEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceListingEntity, experience => experience.experienceDays)
    @JoinColumn({ name: 'experienceId' })
    experience: ExperienceListingEntity

    @Column()
    experienceId: string;

    @Column({
        type: 'enum',
        enum: ExperienceDayEnum,
    })
    experienceDay: ExperienceDayEnum;

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

    @Column('int')
    minSeat: number;

    @Column('int')
    maxSeat: number;

    @OneToMany(() => ExperienceDaySlotsEntity, experienceDaySlots => experienceDaySlots.experienceDay)
    experienceDaySlots: ExperienceDaySlotsEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}