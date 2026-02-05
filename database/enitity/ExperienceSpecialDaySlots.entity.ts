import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExperienceSpecialDayEntity } from "./ExperienceSpecialDay.entity";

export enum ExperienceBookingTypeEnum {
    REQUEST = 'request',
    INSTANT = 'instant',
}

@Entity('experience_special_day_slot')
export class ExperienceSpecialDaySlotsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceSpecialDayEntity, experienceSpecialDay => experienceSpecialDay.experienceSpecialDaySlots)
    @JoinColumn({ name: 'experienceSpecialDayId' })
    experienceSpecialDay: ExperienceSpecialDayEntity

    @Column()
    experienceSpecialDayId: number;

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