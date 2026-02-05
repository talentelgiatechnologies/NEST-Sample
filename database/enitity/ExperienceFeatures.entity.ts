import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExperienceListingEntity } from "./Experience.entity";

export enum ExperienceFeatureValue {
    YES = "1",
    NO = "0"
}

@Entity('experience_features')
export class ExperienceFeaturesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceListingEntity, experience => experience.features)
    @JoinColumn({ name: 'experienceId' })
    experience: ExperienceListingEntity;

    @Column('uuid')
    experienceId: string;

    @Column()
    feature: string;

    @Column({
        type: 'enum',
        enum: ExperienceFeatureValue,
        default: ExperienceFeatureValue.YES
    })
    featureValue: ExperienceFeatureValue

}