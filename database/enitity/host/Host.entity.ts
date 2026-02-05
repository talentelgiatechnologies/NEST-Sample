import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { HostDocumentEntity } from './HostDocument.entity';
import { HostContactEntity } from './HostContact.entity';
import { HostBankEntity } from './HostBank.entity';
import { HostBasicEntity } from './HostBasic.entity';
import { HostTaxEntity } from './HostTax.entity';
import { User } from '../User.entity';

export enum HostType {
  INDIVIDUAL = "1",
  COMPANY = "2"
}

@Entity('host')
export class HostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  processingPolicyTimestamp: string;

  // Step 1: Persona Type
  @Column({
    type: 'enum',
    enum: HostType
  })
  hostType: HostType;

  // Step 6: Documents and Contract
  @Column({ nullable: true })
  contractAcceptanceTimestamp: string;

  @Column({ nullable: true, type: 'float' })
  serviceFee: number;

  @Column({ default: "1" })
  status: string;

  // One-to-many relationship with documents
  @OneToMany(() => HostDocumentEntity, document => document.host, { cascade: true })
  documents: HostDocumentEntity[];

  // One-to-many relationship with contacts
  @OneToMany(() => HostContactEntity, contact => contact.host, { cascade: true })
  contacts: HostContactEntity[];

  @OneToOne(() => HostBasicEntity, basic => basic.host)
  basic: HostBasicEntity;

  @OneToOne(() => HostBankEntity, bank => bank.host)
  bank: HostBankEntity;

  @OneToOne(() => HostTaxEntity, tax => tax.host)
  tax: HostTaxEntity;

  @OneToOne(() => User, user => user.host)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
