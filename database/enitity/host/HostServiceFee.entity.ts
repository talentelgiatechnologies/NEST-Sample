import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../User.entity";
import { FeeType } from "../ServiceFee.entity";

@Entity("host_service_fee")
export class HostServiceFee {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.serviceFee)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @Column({ type: 'float' })
    serviceFee: number;

    @Column({ type: 'enum', enum: FeeType, default: FeeType.PERCENTAGE })
    feeType: FeeType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}