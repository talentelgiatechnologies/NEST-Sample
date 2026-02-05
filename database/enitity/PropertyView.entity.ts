import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";
import { Property } from "./Property.entity";

@Entity()
export class PropertyView {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => User, (user) => user.propertyViews, { nullable: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'uuid', nullable: true })
    userId: string;

    @Column({ nullable: false })
    ipAddress: string;

    @Column({ nullable: true })
    userAgent: string;

    @ManyToOne(() => Property, (property) => property.views, { nullable: false })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @Column('uuid')
    propertyId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}