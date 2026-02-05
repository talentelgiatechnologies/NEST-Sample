import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PayoutAccount } from "./PayoutAccount.entity";

export enum PayoutType {
    PAYPAL = "PAYPAL",
    STRIPE = "STRIPE"
}

@Entity()
export class PayoutDetails {
    @PrimaryGeneratedColumn()
    id: string;

    @OneToOne(() => PayoutAccount, (payout) => payout.details, { nullable: false })
    @JoinColumn({ name: 'payoutAccountId' })
    payoutAccount: PayoutAccount;

    @Column()
    payoutAccountId: number;

    @Column('varchar')
    country: string;

    @Column('varchar')
    addressLine1: string;

    @Column('varchar', { nullable: true })
    addressLine2: string;

    @Column('varchar')
    city: string;

    @Column('varchar')
    state: string;

    @Column('varchar')
    postalCode: string;

    @Column('varchar', { nullable: true })
    accountId: string;

    @Column('varchar', { nullable: true })
    email: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}