import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CurrencyRate } from './CurrencyRate.entity';

@Entity()
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  currency: string;

  @Column({ default: 0 })
  isBase: number;

  @Column({ default: 1 })
  isActive: number;

  @OneToMany(() => CurrencyRate, (rate) => rate.targetCurrency)
  targetRates: CurrencyRate[];
}
