import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ExperienceListingRulesEntity } from './ExperienceListingRules.entity';

@Entity('experience_rule')
export class ExperienceRuleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ unique: true })
    rule: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => ExperienceListingRulesEntity, rules => rules.experience)
    experienceRules: ExperienceListingRulesEntity[];
}
