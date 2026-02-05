import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExperienceListingEntity } from "./Experience.entity";
// import { ExperienceImagesEntity } from "./ExperienceImages.entity";

@Entity('experience_activities')
export class ExperienceActivitiesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceListingEntity, (experience) => experience.activities)
    @JoinColumn({ name: 'experienceId' })
    experience: ExperienceListingEntity;

    @Column('uuid')
    experienceId: string;

    @Column()
    activityTitle: string;

    @Column({ type: 'varchar', length: 500 })
    activityDescription: string;

    // @ManyToOne(() => ExperienceImagesEntity, activityImage => activityImage.activities)
    // @JoinColumn({ name: 'activityImageId' })
    // activityImage: ExperienceImagesEntity;

    // @Column('int', { nullable: true })
    // activityImageId: number;

}