import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExperienceListingEntity } from "./Experience.entity";
import { ExperienceRuleEntity } from "./ExperienceRule.entity";

@Entity('experience_listing_rules')
export class ExperienceListingRulesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceListingEntity, (experience)=> experience.rules)
    @JoinColumn({ name: 'experienceId' })
    experience: ExperienceListingEntity;

    @Column('uuid')
    experienceId: string;

    @ManyToOne(() => ExperienceRuleEntity, (rules)=> rules.experienceRules)
    @JoinColumn({ name: 'ruleId' })
    rule: ExperienceRuleEntity;

    @Column('int')
    ruleId: number;
}