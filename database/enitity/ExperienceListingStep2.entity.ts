import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExperienceListingEntity } from "./Experience.entity";
import { ExperienceImagesEntity } from "./ExperienceImages.entity";

@Entity('experience_listing_step2')
export class ExperienceListingStep2Entity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceListingEntity, experience => experience.step2)
    @JoinColumn({ name: 'experienceId' })
    experience: ExperienceListingEntity;

    @Column('uuid')
    experienceId: string;
    

    @Column()
    title: string;

    @Column({ unique: true, nullable: true })
    slugUrl: string;

    @Column({ type: 'varchar', length: 1000, nullable: true })
    description: string;

   
}