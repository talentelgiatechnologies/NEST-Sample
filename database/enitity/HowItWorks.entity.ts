import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("how_it_works")
export class HowItWorksEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image: string;

    @Column()
    title: string;

    @Column()
    description: string;
}