import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExperienceListingEntity } from "./Experience.entity";

export enum ExperienceDateEnum {
    BLOCK = 'block',
    OPEN = 'open',
};

@Entity()
export class ExperienceDatesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceListingEntity, (experience)=> experience.dates)
    @JoinColumn({ name: 'experienceId' })
    experience: ExperienceListingEntity;

    @Column('uuid')
    experienceId: string;

    @Column()
    date: string;

    @Column('float', { nullable: true })
    specialPrice: number;

    @Column({
        type: 'enum',
        enum: ExperienceDateEnum,
        default: 'block',
    })
    dateType: ExperienceDateEnum;
}