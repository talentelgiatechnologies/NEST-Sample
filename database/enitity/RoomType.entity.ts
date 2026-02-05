import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Property } from './Property.entity';
import { Expose } from 'class-transformer';
import { config } from '../../lib/config';

@Entity()
export class RoomType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    image: string;

    @Expose()
    get imageWithUrl(): string {
        const baseUrl = config().PROPERTY_PATH;
        return this.image ? baseUrl + this.image : null;
    }

    @Column({ unique: true })
    roomTypeName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Property, (property) => property.user)
    properties: Property[];
}
