import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "./Property.entity";
import { Amenities } from "./Amenities.entity";

@Entity()
export class PropertyAmenities {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Property, { nullable: false })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @Column('uuid')
    propertyId: string;

    @ManyToOne(() => Amenities, { nullable: false })
    @JoinColumn({ name: 'amenitiesId' })
    amenities: Amenities;

    @Column('int')
    amenitiesId: number;
}