import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExperienceListingEntity } from "./Experience.entity";

@Entity('experience_listing_step1')
export class ExperienceListingStep1Entity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceListingEntity, experience => experience.step1)
    @JoinColumn({ name: 'experienceId' })
    experience: ExperienceListingEntity;

    @Column('uuid')
    experienceId: string;

    @Column({type: 'varchar', length: 40 })
    introduction: string;

    @Column({ unique: true, nullable: true })
    slugUrl: string;

    @Column({ type: 'varchar', length: 1000 })
    expertise: string;

    @Column({ type: 'varchar', length: 1000, nullable: true })
    recognition: string;

   
}