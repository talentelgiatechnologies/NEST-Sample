import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "./Property.entity";
import { PropertyStep2 } from "./PropertyStep2.entity";
import { Expose } from "class-transformer";
import { config } from "../../lib/config";

export enum Classified {
    Artificial = "Artificial",
    Human = "Human"
}
@Entity()
export class PropertyImages {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Property, { nullable: false })
    @JoinColumn({ name: 'propertyId' })
    property: Property;

    @Column('uuid')
    propertyId: string;

    @Column()
    image: string;

    @Column({
        type: "enum",
        enum: Classified,
        default: Classified.Human
    })
    classified: Classified;

    @Column({
        type: 'float',
        default: null,
        nullable: true
    })
    probability: number;

    @Expose()
    get imageWithUrl(): string {
        const baseUrl = config().PROPERTY_PATH;
        return this.image ? baseUrl + this.image : null;
    }

    @OneToOne(() => PropertyStep2, (step2) => step2.coverImage, { nullable: true })
    propertyStep2: PropertyStep2;
}