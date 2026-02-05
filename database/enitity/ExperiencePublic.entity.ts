import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExperienceListingStep5Entity } from "./ExperienceListingStep5.entity";


export enum ExperiencePublicLocationType {
    WORKSHOP = "WORKSHOP",
    HOME = "HOME",
}

@Entity('experience_public')
export class ExperiencePublicEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => ExperienceListingStep5Entity, step5 => step5.publicStep5)
    @JoinColumn({ name: 'step5Id' })
    step5: ExperienceListingStep5Entity;

    @Column()
    step5Id: number;

    @Column({
        type: 'enum',
        enum: ExperiencePublicLocationType,
        default: ExperiencePublicLocationType.WORKSHOP
    })
    locationType: ExperiencePublicLocationType;

    @Column({ type: 'float' })
    basePrice: number;

    @Column({ type: 'varchar', length: 300, nullable: true })
    address: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    street: string;

    @Column({ nullable: true })
    area: string;

    @Column({ nullable: true })
    building: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    zipCode: string;

    @Column('decimal', { precision: 10, scale: 6, nullable: true })
    lat: number;

    @Column('decimal', { precision: 10, scale: 6, nullable: true })
    lng: number;

}