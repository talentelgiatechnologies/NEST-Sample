import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("benefits")
export class BenefitsEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    image: string;

    @Column()
    title: string;

    @Column()
    description: string;
}