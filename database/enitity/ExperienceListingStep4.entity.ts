import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExperienceListingEntity } from "./Experience.entity";

export enum ExperienceDurationType {
    HOURS = "1",
    DAYS = "2"
}

@Entity('experience_listing_step4')
export class ExperienceListingStep4Entity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceListingEntity, experience => experience.step4)
    @JoinColumn({ name: 'experienceId' })
    experience: ExperienceListingEntity;

    @Column('uuid')
    experienceId: string;

    @Column('float')
    duration: number;

    @Column({
        type: 'enum',
        enum: ExperienceDurationType,
        default: ExperienceDurationType.HOURS
    })
    durationType: ExperienceDurationType;

}