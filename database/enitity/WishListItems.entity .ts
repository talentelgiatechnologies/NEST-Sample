import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { WishList } from './WishList.entity';
import { Property } from './Property.entity';
import { ExperienceListingEntity } from './Experience.entity';

@Entity()
export class WishListItems {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WishList, (wishList) => wishList.wishListItems, { nullable: false })
  @JoinColumn({ name: 'wishListId' })
  wishList: WishList;

  @Column('uuid')
  wishListId: string;

  @ManyToOne(() => ExperienceListingEntity, (experience) => experience.wishListItems, { nullable: false })
  @JoinColumn({ name: 'experienceId' })
  experience: ExperienceListingEntity;

  @Column('uuid')
  experienceId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
