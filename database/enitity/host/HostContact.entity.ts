import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { HostEntity } from './Host.entity';

export enum HostContactType {
    RESERVATION = "1",
    PAYMENT = "2",
    FINANCE = "3"
}

@Entity('host_contact')
export class HostContactEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: HostContactType
    })
    contactType: HostContactType;

    @Column()
    contactName: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    hostId: number;

    @ManyToOne(() => HostEntity, host => host.contacts)
    @JoinColumn({ name: 'hostId' })
    host: HostEntity;
}
