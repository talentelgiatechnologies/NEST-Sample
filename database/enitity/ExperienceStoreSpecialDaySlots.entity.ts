import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExperienceSpecialDayEntity } from "./ExperienceSpecialDay.entity";

export enum ExperienceBookingTypeEnum {
    REQUEST = 'request',
    INSTANT = 'instant',
}

@Entity('experience_store_special_day_slot')
export class ExperienceStoreSpecialDaySlotsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceStoreSpecialDaySlotsEntity, experienceStoreSpecialDay => experienceStoreSpecialDay.experienceStoreSpecialDay)
    @JoinColumn({ name: 'experienceStoreSpecialDayId' })
    experienceStoreSpecialDay: ExperienceStoreSpecialDaySlotsEntity

    @Column()
    experienceStoreSpecialDayId: number;

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