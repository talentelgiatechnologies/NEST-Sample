import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExperienceListingEntity } from "./Experience.entity";

@Entity('experience_listing_social_link')
export class ExperienceListingSocialLinkEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceListingEntity, experience => experience.socialLinks)
    @JoinColumn({ name: 'experienceId' })
    experience: ExperienceListingEntity;

    @Column('uuid')
    experienceId: string;


    @Column({ type: 'varchar', length: 100 })
    url: string;

   
}