import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('badge')
export class BadgeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    desc: string;

    @Column()
    image: string;
}