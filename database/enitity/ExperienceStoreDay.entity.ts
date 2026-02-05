import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExperienceListingEntity } from "./Experience.entity";
import { ExperienceDayEnum, ExperienceDayOpenEnum, ExperienceWholeDayEnum } from "./ExperienceDay.entity";
import { ExperienceStoreDaySlotsEntity } from "./ExperienceStoreDaySlots.entity";

@Entity('experience_store_day')
export class ExperienceStoreDayEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceListingEntity, experience => experience.experienceStoreDays)
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

    @OneToMany(() => ExperienceStoreDaySlotsEntity, experienceStoreDaySlots => experienceStoreDaySlots.experienceDay)
    experienceStoreDaySlots: ExperienceStoreDaySlotsEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}