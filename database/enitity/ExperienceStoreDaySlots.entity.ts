import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ExperienceStoreDayEntity } from "./ExperienceStoreDay.entity";
import { ExperienceBookingTypeEnum } from "./ExperienceDaySlots.entity";

@Entity('experience_store_day_slot')
export class ExperienceStoreDaySlotsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceStoreDayEntity, experienceDay => experienceDay.experienceStoreDaySlots)
    @JoinColumn({ name: 'experienceDayId' })
    experienceDay: ExperienceStoreDayEntity

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