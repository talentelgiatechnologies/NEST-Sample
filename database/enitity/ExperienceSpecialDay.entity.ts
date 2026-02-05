import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExperienceListingEntity } from "./Experience.entity";
import { ExperienceSpecialDaySlotsEntity } from "./ExperienceSpecialDaySlots.entity";



export enum ExperienceDayOpenEnum {
    OPEN = 1,
    CLOSED = 0
}

export enum ExperienceWholeDayEnum {
    WHOLE_DAY = 1,
    NOT_WHOLE_DAY = 0
}

@Entity('experience_special_day')
export class ExperienceSpecialDayEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceListingEntity, experience => experience.experienceSpecialDays)
    @JoinColumn({ name: 'experienceId' })
    experience: ExperienceListingEntity

    @Column()
    experienceId: string;

    @Column({
        type: 'date'
    })
    experienceDay: Date;

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

    @OneToMany(() => ExperienceSpecialDaySlotsEntity, experienceSpecialDaySlots => experienceSpecialDaySlots.experienceSpecialDay)
    experienceSpecialDaySlots: ExperienceSpecialDaySlotsEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}