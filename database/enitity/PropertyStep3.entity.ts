import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "./Property.entity";

export enum AvailabilityEnum {
    ONE_MONTH = '1month',
    THREE_MONTHS = '3month',
    SIX_MONTHS = '6month',
    TWELVE_MONTHS = '12month',
    ALL = 'all',
}

export enum BookingTypeEnum {
    REQUEST = 'request',
    INSTANT = 'instant',
}
export const AvailabilityList = [
    AvailabilityEnum.ONE_MONTH,
    AvailabilityEnum.THREE_MONTHS,
    AvailabilityEnum.SIX_MONTHS,
    AvailabilityEnum.TWELVE_MONTHS,
    AvailabilityEnum.ALL,
];
export const BookingTypeList = [
    BookingTypeEnum.REQUEST,
    BookingTypeEnum.INSTANT,
];

@Entity()
export class PropertyStep3 {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Property, { nullable: false })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @Column('uuid')
    propertyId: string;

    @Column()
    checkIn: string;

    @Column()
    checkOut: string;

    @Column()
    currency: string;

    @Column({ type: 'float' })
    basePrice: number;

    @Column({ type: 'float', nullable: true })
    tax: number;

    @Column({ type: 'float', nullable: true })
    cleaningFee: number;

    @Column({ type: 'float', nullable: true })
    weeklyDiscount: number;

    @Column({ type: 'float', nullable: true })
    monthlyDiscount: number;

    @Column({ type: "int", })
    cancellationPolicy: number;

    @Column({
        type: 'enum',
        enum: AvailabilityList
    })
    availability: AvailabilityEnum;

    @Column({ type: 'int' })
    minStay: number;

    @Column({ type: 'int' })
    maxStay: number;

    @Column({ type: 'enum', enum: BookingTypeList })
    bookingType: BookingTypeEnum;

}