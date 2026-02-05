import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CouponCode } from "./CouponCode.entity";
import { User } from "./User.entity";
import { ExperienceBookingEntity } from "./ExperienceBooking.entity";

@Entity('coupon_code_usage')
export class CouponCodeUsage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    couponCode: number;

    @Column()
    userId: string;

    @ManyToOne(() => CouponCode, (coupon) => coupon.usages)
    @JoinColumn({ name: 'couponCode' })
    coupon: CouponCode;

    @ManyToOne(() => User, (user) => user.couponsUsed)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    bookingId: string;

    @OneToOne(()=> ExperienceBookingEntity, (booking) => booking.coupon)
    @JoinColumn({ name: 'bookingId' })
    booking: ExperienceBookingEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}