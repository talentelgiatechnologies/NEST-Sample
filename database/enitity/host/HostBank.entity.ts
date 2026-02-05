import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { HostEntity } from "./Host.entity";

@Entity('host_bank')
export class HostBankEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ nullable: true })
    bank: string;

    @Column({ nullable: true })
    accountType: string;

    @Column({ nullable: true })
    accountNumber: string;

    @Column({ nullable: true })
    accountHolder: string;

    @Column({ nullable: true })
    idDocumentType: string;

    @Column({ nullable: true })
    idDocumentNumber: string;

    @Column()
    hostId: number;

    @OneToOne(() => HostEntity, host => host.bank)
    @JoinColumn({ name: 'hostId' })
    host: HostEntity;
}