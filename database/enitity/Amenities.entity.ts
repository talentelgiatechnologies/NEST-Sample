import { Expose } from 'class-transformer';
import { config } from '../../lib/config';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Amenities {
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
    amenities: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
