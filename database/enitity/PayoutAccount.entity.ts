import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";
import { PayoutDetails } from "./PayoutDetails.entity";
import { Payout } from "./Payout.entity";

export enum PayoutType {
    PAYPAL = "PAYPAL",
    STRIPE = "STRIPE"
}

@Entity()
export class PayoutAccount {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.payouts, { nullable: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column('uuid')
    userId: string;

    @Column('varchar', { nullable: true })
    paymentId: string;

    @Column('boolean', { nullable: false, default: 0 })
    defaultPayout: boolean;

    @Column('smallint', { default: 0 })
    isVerified: number;

    @Column({
        type: "enum",
        enum: PayoutType,
        default: PayoutType.STRIPE
    })
    payoutType: PayoutType;

    @OneToOne(() => PayoutDetails, (payoutDetails) => payoutDetails.payoutAccount)
    details: PayoutDetails;

    @OneToMany(() => Payout, (payout) => payout.payoutAccount)
    payout: Payout[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}