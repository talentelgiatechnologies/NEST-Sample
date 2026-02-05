import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { HostEntity } from "./Host.entity";

@Entity('host_basic')
export class HostBasicEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    tradeName: string;

    @Column({ nullable: true })
    corporateName: string;

    @Column({ nullable: true })
    identificationNumber: string;

    @Column({ nullable: true })
    taxIdNumber: string;

    @Column({ nullable: true })
    legalRepresentative: string;

    @Column()
    hostId: number;

    @OneToOne(() => HostEntity, host => host.basic)
    @JoinColumn({ name: 'hostId' })
    host: HostEntity;


}