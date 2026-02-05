import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExperienceListingEntity } from "./Experience.entity";

@Entity('experience_description_items')
export class ExperienceDescriptionItems {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    experienceId: string;

    @ManyToOne(() => ExperienceListingEntity, (experience) => experience.descriptionItems, { onDelete: 'CASCADE' })
    experience: ExperienceListingEntity;

    @Column()
    descriptionItem: string;
}

        
