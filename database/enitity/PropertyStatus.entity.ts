import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Property } from "./Property.entity";

export type PropertyStatusType = 'pending' | 'inProgress' | 'completed';
export type PropertyPublishType = 'requested' | 'rejected' | 'approved' | 'pending';

@Entity()
export class PropertyStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Property, { nullable: false })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @Column('uuid')
    propertyId: string;

    @Column({
        type: 'enum',
        enum: ['pending', 'inProgress', 'completed'],
        default: 'pending',
    })
    step1: PropertyStatusType;

    @Column({
        type: 'enum',
        enum: ['pending', 'inProgress', 'completed'],
        default: 'pending',
    })
    step2: PropertyStatusType;

    @Column({
        type: 'enum',
        enum: ['pending', 'inProgress', 'completed'],
        default: 'pending',
    })
    step3: PropertyStatusType;

    @Column({
        type: 'enum',
        enum: ['pending', 'requested', 'rejected', 'approved'],
        default: 'pending',
    })
    publishStatus: PropertyPublishType;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    approvedAt: Date;

    @Column({
        type: 'varchar',
        nullable: true
    })
    reason: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}