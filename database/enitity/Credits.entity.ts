import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";
import { ExperienceBookingEntity } from "./ExperienceBooking.entity";

export enum CreditStatus {
    USED = "USED",
    BALANCE = "BALANCE"
}

@Entity('credits')
export class Credits {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @ManyToOne(()=> User, (user) => user.credits)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    bookingId: string;

    @ManyToOne(() => ExperienceBookingEntity, (booking) => booking.balanceCredit)
    @JoinColumn({ name: 'bookingId' })
    booking: ExperienceBookingEntity;

    @Column({nullable: true})
    usedBookingId: string;

    @ManyToOne(() => ExperienceBookingEntity, (booking) => booking.usedCredit)
    @JoinColumn({ name: 'usedBookingId' })
    usedBooking: ExperienceBookingEntity;

    @Column({
        type: "enum",
        enum: CreditStatus,
        default: CreditStatus.BALANCE
    })
    status: CreditStatus;

    @Column('date', {nullable: true})
    expiryDate: Date;

    @Column("float")
    credit: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}