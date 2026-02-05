import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from './User.entity';
import { PlaceType } from './PlaceType.entity';
import { RoomType } from './RoomType.entity';
import { PropertyAmenities } from './PropertyAmenities.entity';
import { PropertySafetyAmenities } from './PropertySafetyAmenities.entity';
import { PropertyBathroom } from './PropertyBathroom.entity';
import { PropertyStep2 } from './PropertyStep2.entity';
import { PropertyStep3 } from './PropertyStep3.entity';
import { PropertyHouseRules } from './PropertyHouseRules.entity';
import { PropertyDates } from './PropertyDates.entity';
import { PropertyImages } from './PropertyImages.entity';
import { PropertyStatus } from './PropertyStatus.entity';
import { Booking } from './Booking.entity';
import { PropertyView } from './PropertyView.entity';
import { Message } from './Message.entity';
import { WishListItems } from './WishListItems.entity ';
import { Review } from './Review.entity';
import { PropertySpaces } from './PropertySpaces.entity';

@Entity()
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.properties, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => PlaceType, (placeType) => placeType.properties, { nullable: false })
  @JoinColumn({ name: 'placeTypeId' })
  placeType: PlaceType;

  @Column('int')
  placeTypeId: number;

  @ManyToOne(() => RoomType, (roomType) => roomType.properties, { nullable: false })
  @JoinColumn({ name: 'roomTypeId' })
  roomType: RoomType;

  @Column('int')
  roomTypeId: number;

  @Column('int')
  bathroomCount: number;

  @Column('int')
  guests: number;

  @Column('int')
  beds: number;

  @Column('int')
  bedrooms: number;

  @Column({ type: 'smallint', default: 0 })
  recommended: number;

  @Column()
  country: string;

  @Column()
  street: string;

  @Column({ nullable: true })
  building?: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @Column('decimal', { precision: 10, scale: 6 })
  lat: number;

  @Column('decimal', { precision: 10, scale: 6 })
  lng: number;

  @OneToMany(() => PropertyAmenities, (amenities) => amenities.property, { nullable: false })
  propertyAmenities: PropertyAmenities[];

  @OneToMany(() => Review, (review) => review.property, { nullable: false })
  reviews: Review[];

  @OneToMany(() => PropertyImages, (amenities) => amenities.property, { nullable: false })
  propertyImages: PropertyImages[];

  @OneToMany(() => PropertyDates, (dates) => dates.property, { nullable: false })
  propertyDates: PropertyDates[];

  @OneToMany(() => PropertyHouseRules, (houseRules) => houseRules.property, { nullable: false })
  propertyHouseRules: PropertyHouseRules[];

  @OneToOne(() => PropertyStep2, (step2) => step2.property, { nullable: false })
  propertyStep2: PropertyStep2;

  @OneToOne(() => PropertyStep3, (step3) => step3.property, { nullable: false })
  propertyStep3: PropertyStep3;

  @OneToMany(() => PropertyBathroom, (bathroom) => bathroom.property, { nullable: false })
  propertyBathrooms: PropertyBathroom[];

  @OneToMany(() => PropertyView, (view) => view.property, { nullable: false })
  views: PropertyView[];

  @OneToMany(() => PropertySafetyAmenities, (safetyAmenity) => safetyAmenity.property, { nullable: false })
  propertySafetyAmenities: PropertySafetyAmenities[];

  @OneToMany(() => PropertySpaces, (spaces) => spaces.property, { nullable: false })
  propertySpaces: PropertySpaces[];

  // @OneToMany(() => WishListItems, (wishListItems) => wishListItems.property, { nullable: false })
  // wishListItems: WishListItems[];

  @OneToOne(() => PropertyStatus, (status) => status.property, { nullable: false })
  propertyStatus: PropertyStatus;

  @OneToMany(() => Booking, (booking) => booking.property)
  bookings: Booking[];

  @OneToMany(() => Message, (message) => message.property)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
