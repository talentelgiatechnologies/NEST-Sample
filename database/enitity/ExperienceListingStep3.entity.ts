import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExperienceListingEntity } from "./Experience.entity";
import { ExperienceImagesEntity } from "./ExperienceImages.entity";

@Entity('experience_listing_step3')
export class ExperienceListingStep3Entity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceListingEntity, experience=> experience.step3)
    @JoinColumn({ name: 'experienceId' })
    experience: ExperienceListingEntity;

    @Column('uuid')
    experienceId: string;

    @OneToOne(() => ExperienceImagesEntity, coverImage=> coverImage.step3)
    @JoinColumn({ name: 'coverImageId' })
    coverImage: ExperienceImagesEntity;

    @Column('int')
    coverImageId: number;

    

}