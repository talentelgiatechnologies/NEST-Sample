import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExperienceDayEntity } from "./ExperienceDay.entity";

export enum ExperienceBookingTypeEnum {
    REQUEST = 'request',
    INSTANT = 'instant',
}

@Entity('experience_day_slot')
export class ExperienceDaySlotsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceDayEntity, experienceDay => experienceDay.experienceDaySlots)
    @JoinColumn({ name: 'experienceDayId' })
    experienceDay: ExperienceDayEntity

    @Column()
    experienceDayId: number;

    @Column({
        type: 'float'
    })
    fhour: number;

    @Column({
        type: 'float'
    })
    thour: number;

    @Column({
        type: 'float'
    })
    fminute: number;

    @Column({
        type: 'float'
    })
    tminute: number;

    @Column({
        enum: ExperienceBookingTypeEnum,
        type: 'enum',
        default: ExperienceBookingTypeEnum.INSTANT
    })
    experienceBookingType: ExperienceBookingTypeEnum;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}