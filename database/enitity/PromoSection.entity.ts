import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("promo_section")
export class PromoSectionEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image: string;

    @Column()
    title: string;

    @Column()
    subTitle: string;

    @Column()
    url: string;
}