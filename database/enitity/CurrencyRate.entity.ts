import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Currency } from './Currency.entity';

@Entity()
export class CurrencyRate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    targetCurrencyId: number;

    @ManyToOne(() => Currency, (currency) => currency.targetRates)
    @JoinColumn({ name: 'targetCurrencyId' })
    targetCurrency: Currency;

    @Column('decimal', { precision: 18, scale: 8 })
    rate: number;
}
