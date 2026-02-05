import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "./Property.entity";
import { SafetyAmenities } from "./SafetyAmenities.entity";

@Entity()
export class PropertySafetyAmenities {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Property, { nullable: false })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @Column('uuid')
    propertyId: string;

    @ManyToOne(() => SafetyAmenities, { nullable: false })
    @JoinColumn({ name: 'safetyAmenityId' })
    safetyAmenity: SafetyAmenities;

    @Column('int')
    safetyAmenityId: number;
}