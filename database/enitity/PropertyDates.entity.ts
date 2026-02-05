import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "./Property.entity";
import { Booking } from "./Booking.entity";

export enum PropertyDateEnum {
    BLOCK = 'block',
    OPEN = 'open',
};

export const PropertyDateList = [
    PropertyDateEnum.BLOCK,
    PropertyDateEnum.OPEN,
];

@Entity()
export class PropertyDates {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Property, { nullable: false })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @Column('uuid')
    propertyId: string;

    @ManyToOne(() => Booking, { nullable: true })
    @JoinColumn({ name: 'bookingId' })
    booking: Booking;

    @Column('uuid', { nullable: true })
    bookingId: string;

    @Column()
    date: string;

    @Column('float', { nullable: true })
    specialPrice: number;

    @Column({
        type: 'enum',
        enum: PropertyDateList,
        default: 'block',
    })
    dateType: PropertyDateEnum;
}