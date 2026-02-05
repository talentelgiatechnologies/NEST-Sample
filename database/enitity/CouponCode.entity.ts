import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User.entity';
import { ExperienceCategoriesEntity } from './ExperienceCategories.entity';
import { CouponCodeUsage } from './CouponCodeUsage.entity';

export enum COUPON_CODE_TYPE_ENUM {
    FIXED = "1",
    PERCENTAGE = "2"
}

export enum COUPON_STATUS {
    ACTIVE = "1",
    IN_ACTIVE = "0"
}

@Entity('coupon_code')
export class CouponCode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    code: string;

    @ManyToOne(() => User, (user) => user.coupons, { nullable: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column('uuid', { nullable: true })
    userId: string;

    @Column({ type: 'decimal', nullable: true })
    minAmount: number | null;

    @Column({ type: 'date', nullable: true })
    expiresAt: Date | null;

    @Column({ default: 1, type: 'int' })
    count: number;

    @ManyToOne(() => ExperienceCategoriesEntity, (category) => category.coupons, { nullable: true })
    @JoinColumn({ name: 'categoryId' })
    category: ExperienceCategoriesEntity;

    @Column('int', { nullable: true })
    categoryId: number;

    @Column({
        type: 'enum',
        enum: COUPON_CODE_TYPE_ENUM,
        default: COUPON_CODE_TYPE_ENUM.FIXED
    })
    couponType: COUPON_CODE_TYPE_ENUM;

    @Column({
        type: 'enum',
        enum: COUPON_STATUS,
        default: COUPON_STATUS.ACTIVE
    })
    couponStatus: COUPON_STATUS;

    @Column('float', { nullable: false })
    couponValue: number;

    @Column()
    description: string;

    @Column()
    currency: string;

    @Column()
    title: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => CouponCodeUsage, (usage) => usage.coupon)  
    usages: CouponCodeUsage[];
}
