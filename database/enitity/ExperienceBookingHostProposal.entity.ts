import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ExperienceBookingEntity } from './ExperienceBooking.entity';

export enum ExperienceType {
  PRIVATE = '1',
  PUBLIC = '2',
}

@Entity('experience_booking_host_proposal')
export class ExperienceBookingHostProposalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => ExperienceBookingEntity, (experienceBooking) => experienceBooking.hostProposal, { nullable: false })
  @JoinColumn({ name: 'experienceBookingId' })
  experienceBooking: ExperienceBookingEntity;

  @Column('uuid')
  experienceBookingId: string;

  @Column('float')
  basePrice: number;

  @Column('float')
  avgBasePrice: number;

  @Column('float')
  cleaningFee: number;

  @Column('float')
  tax: number;

  @Column({ type: 'float', default: 0 })
  serviceFee: number;

  @Column({ type: 'float', default: 0 })
  hostServiceFee: number;

  @Column('float')
  total: number;

  @Column('float')
  discount: number;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'float', nullable: false })
  startTime: number;

  @Column({ type: 'float', nullable: false })
  endTime: number;

  @Column('int', { nullable: false, default: 1 })
  guests: number;

  @Column({
    type: 'enum',
    enum: ExperienceType,
    default: ExperienceType.PRIVATE
  })
  experienceType: ExperienceType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
