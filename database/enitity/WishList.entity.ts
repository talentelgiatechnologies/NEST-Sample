import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from './User.entity';
import { WishListItems } from './WishListItems.entity ';

@Entity()
export class WishList {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.wishLists, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  userId: string;

  @Column({ type: "varchar" })
  wishListName: string;

  @OneToMany(() => WishListItems, (wishListItems) => wishListItems.wishList, { nullable: false })
  wishListItems: WishListItems[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
