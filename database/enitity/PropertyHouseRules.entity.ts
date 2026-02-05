import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "./Property.entity";
import { HouseRule } from "./HouseRule.entity";

@Entity()
export class PropertyHouseRules {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Property, { nullable: false })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @Column('uuid')
    propertyId: string;

    @ManyToOne(() => HouseRule, { nullable: false })
    @JoinColumn({ name: 'houseRuleId' })
    houseRules: HouseRule;

    @Column('int')
    houseRuleId: number;
}