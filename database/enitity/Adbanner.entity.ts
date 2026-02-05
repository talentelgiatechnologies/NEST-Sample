import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("ad_banner")
export class AdBannerEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image: string;

    @Column()
    url: string;
}