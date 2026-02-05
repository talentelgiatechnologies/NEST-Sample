import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "./Property.entity";
import { SharedSpaces } from "./SharedSpaces.entity";

@Entity()
export class PropertySpaces {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Property, { nullable: false })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @Column('uuid')
    propertyId: string;

    @ManyToOne(() => SharedSpaces, { nullable: false })
    @JoinColumn({ name: 'spacesId' })
    spaces: SharedSpaces;

    @Column('int')
    spacesId: number;
}