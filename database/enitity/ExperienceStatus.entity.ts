import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Property } from "./Property.entity";
import { ExperienceListingEntity } from "./Experience.entity";

export enum ExperienceStatusType {
    PENDING = 1,
    IN_PROGRESS = 2,
    COMPLETED = 3
};
export enum ExperiencePublishType {
    REQUESTED = '2',
    PENDING = '1',
    APPROVED = '3',
    REJECTED = '4'
} 

@Entity()
export class ExperienceStatusEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => ExperienceListingEntity, experience => experience.experienceStatus)
    @JoinColumn({ name: 'experienceId' })
    experience: ExperienceListingEntity;

    @Column('uuid')
    experienceId: string;

    @Column({
        type: 'enum',
        enum: ExperienceStatusType,
        default: ExperienceStatusType.PENDING,
    })
    step1: ExperienceStatusType;

    @Column({
        type: 'enum',
        enum: ExperienceStatusType,
        default: ExperienceStatusType.PENDING,
    })
    step2: ExperienceStatusType;

    @Column({
        type: 'enum',
        enum: ExperienceStatusType,
        default: ExperienceStatusType.PENDING,
    })
    step3: ExperienceStatusType;

    @Column({
        type: 'enum',
        enum: ExperienceStatusType,
        default: ExperienceStatusType.PENDING,
    })
    step4: ExperienceStatusType;

    @Column({
        type: 'enum',
        enum: ExperienceStatusType,
        default: ExperienceStatusType.PENDING,
    })
    step5: ExperienceStatusType;

    @Column({
        type: 'enum',
        enum: ExperienceStatusType,
        default: ExperienceStatusType.PENDING,
    })
    step6: ExperienceStatusType;

    @Column({
        type: 'enum',
        enum: ExperiencePublishType,
        default: ExperiencePublishType.PENDING,
    })
    publishStatus: ExperiencePublishType;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    approvedAt: Date;

    @Column({
        type: 'varchar',
        nullable: true
    })
    reason: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}