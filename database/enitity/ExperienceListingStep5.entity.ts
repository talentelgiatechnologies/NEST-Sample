import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExperienceListingEntity } from "./Experience.entity";
import { City } from "./City.entity";
import { ExperiencePrivateEntity } from "./ExperiencePrivate.entity";
import { ExperiencePublicEntity } from "./ExperiencePublic.entity";

export enum ExperienceAvailabilityType {
    HOME = "1",
    STORE = "2",
    BOTH = "3"
}

export enum ExperienceVisibilityOutside {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}

@Entity('experience_listing_step5')
export class ExperienceListingStep5Entity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceListingEntity, experience => experience.step5)
    @JoinColumn({ name: 'experienceId' })
    experience: ExperienceListingEntity;

    @Column('uuid')
    experienceId: string;

    @ManyToOne(() => City, cityData => cityData.experience)
    @JoinColumn({ name: 'cityId' })
    cityData: City;

    @Column({ nullable: true })
    cityId: number;

    @Column({
        type: 'enum',
        enum: ExperienceVisibilityOutside,
        default: ExperienceVisibilityOutside.PUBLIC
    })
    experienceVisibilityOutside: ExperienceVisibilityOutside;

    @Column({
        type: 'enum',
        enum: ExperienceAvailabilityType,
        default: ExperienceAvailabilityType.HOME
    })
    availabilityType: ExperienceAvailabilityType

    @Column()
    cancellationPolicy: string;

    @OneToOne(() => ExperiencePrivateEntity, privateStep5 => privateStep5.step5)
    privateStep5: ExperiencePrivateEntity

    @OneToOne(() => ExperiencePublicEntity, publicStep5 => publicStep5.step5)
    publicStep5: ExperiencePublicEntity

}