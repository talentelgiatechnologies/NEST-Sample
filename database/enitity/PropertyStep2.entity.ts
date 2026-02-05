import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "./Property.entity";
import { PropertyImages } from "./PropertyImages.entity";
import { slugify } from "../../lib/slugify";

@Entity()
export class PropertyStep2 {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Property, { nullable: false })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @Column('uuid')
    propertyId: string;

    @OneToOne(() => PropertyImages, { nullable: true })
    @JoinColumn({ name: 'coverImageId' })
    coverImage: PropertyImages;

    @Column('int')
    coverImageId: number;

    @Column()
    title: string;

    @Column({ unique: true })
    slugUrl: string;

    @Column({ type: 'varchar', length: 1000, nullable: true })
    description: string;

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        this.slugUrl = `${slugify(this.title)}-${this.id}`;
    }
}