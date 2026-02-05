import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Expose } from "class-transformer";
import { config } from "../../lib/config";
import { ExperienceListingEntity } from "./Experience.entity";
import { ExperienceListingStep2Entity } from "./ExperienceListingStep2.entity";
import { ExperienceListingStep3Entity } from "./ExperienceListingStep3.entity";
import { ExperienceActivitiesEntity } from "./ExperienceActivities.entity";

export enum Classified {
    Artificial = "Artificial",
    Human = "Human"
}
@Entity('experience_images')
export class ExperienceImagesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceListingEntity, experience => experience.images)
    @JoinColumn({ name: 'experienceId' })
    experience: ExperienceListingEntity;

    @Column('uuid')
    experienceId: string;

    @Column()
    image: string;

    @Column()
    mimeType: string;

    @Column({
        type: "enum",
        enum: Classified,
        default: Classified.Human
    })
    classified: Classified;

    @Column({
        type: 'float',
        default: null,
        nullable: true
    })
    probability: number;

    @Expose()
    get imageWithUrl(): string {
        const baseUrl = config().EXPERIENCE_PATH;
        return this.image ? baseUrl + this.image : null;
    }

    @OneToOne(() => ExperienceListingStep3Entity, (step3) => step3.coverImage, { nullable: true })
    step3: ExperienceListingStep3Entity;

}