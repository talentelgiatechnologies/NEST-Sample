import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ServiceFeeEnum {
  GUEST_SERVICE_FEE = "GUEST_SERVICE_FEE",
  HOST_SERVICE_FEE = "HOST_SERVICE_FEE"
}

export enum FeeType {
  FLAT = "FLAT",
  PERCENTAGE = "PERCENTAGE"
}

@Entity('service_fee')
export class ServiceFee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: "enum", enum: ServiceFeeEnum })
  serviceFee: ServiceFeeEnum;

  @Column({ type: 'enum', enum: FeeType })
  feeType: FeeType;

  @Column({ type: "float" })
  fees: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


}
