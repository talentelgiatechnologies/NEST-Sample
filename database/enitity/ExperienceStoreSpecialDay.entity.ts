import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExperienceListingEntity } from "./Experience.entity";
import { ExperienceSpecialDaySlotsEntity } from "./ExperienceSpecialDaySlots.entity";
import { ExperienceStoreSpecialDaySlotsEntity } from "./ExperienceStoreSpecialDaySlots.entity";



export enum ExperienceDayOpenEnum {
    OPEN = 1,
    CLOSED = 0
}

export enum ExperienceWholeDayEnum {
    WHOLE_DAY = 1,
    NOT_WHOLE_DAY = 0
}

@Entity('experience_store_special_day')
export class ExperienceStoreSpecialDayEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceListingEntity, experience => experience.experienceStoreSpecialDays)
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

    @OneToMany(() => ExperienceStoreSpecialDaySlotsEntity, experienceStoreSpecialDaySlots => experienceStoreSpecialDaySlots.experienceStoreSpecialDay)
    experienceStoreSpecialDaySlots: ExperienceStoreSpecialDaySlotsEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}