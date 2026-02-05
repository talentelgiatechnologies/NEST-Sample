import { Expose } from "class-transformer";
import { config } from "../../lib/config";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PopularLocation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    image: string;

    @Expose()
    get imageWithUrl(): string {
        const baseUrl = config().PROPERTY_PATH;
        return this.image ? baseUrl + this.image : null;
    }

    @Column('varchar')
    location: string;

    @Column()
    locationLabel: string;

    @Column({ default: true })
    isActive: boolean;

    @Column('float')
    lat: number;

    @Column('float')
    lng: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}