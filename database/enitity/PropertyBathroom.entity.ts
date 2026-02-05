import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "./Property.entity";


export enum BathroomTypeEnum {
    PRIVATE = 'private',
    SHARED = 'shared',
}

export const BathroomTypeList = [
    BathroomTypeEnum.PRIVATE,
    BathroomTypeEnum.SHARED,
];

@Entity()
export class PropertyBathroom {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Property, { nullable: false })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @Column('uuid')
    propertyId: string;

    @Column({
        type: 'enum',
        enum: BathroomTypeList,
        default: 'private',
    })
    bathroomType: BathroomTypeEnum;
}