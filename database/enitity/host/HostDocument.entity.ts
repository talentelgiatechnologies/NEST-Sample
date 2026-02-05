import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { HostEntity } from './Host.entity';

export enum HostDocumentType {
    ID = "ID",
    RUT = "RUT",
    CERTIFICATE_OF_EXISTENCE = "CERTIFICATE_OF_EXISTENCE",
    BANK_CERTIFICATE = "BANK_CERTIFICATE"
}

@Entity('host_document')
export class HostDocumentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: HostDocumentType
    })
    documentType: HostDocumentType;

    @Column()
    fileName: string;

    @Column()
    mimeType: string;

    @CreateDateColumn()
    uploadedAt: Date;

    @Column()
    hostId: number;

    @ManyToOne(() => HostEntity, host => host.documents)
    @JoinColumn({ name: 'hostId' })
    host: HostEntity;
}
