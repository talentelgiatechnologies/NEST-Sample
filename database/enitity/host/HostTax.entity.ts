import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { HostEntity } from "./Host.entity";

export enum YesNo {
    YES = "1",
    NO = "0"
}

@Entity('host_tax')
export class HostTaxEntity {
    @PrimaryGeneratedColumn()
    id: string;

    // Step 4: Tax Information
    @Column({
        type: 'enum',
        enum: YesNo,
        default: YesNo.NO
    })
    vatResponsible: YesNo;

    @Column({
        type: 'enum',
        enum: YesNo,
        default: YesNo.NO
    })
    simplifiedTaxRegime: YesNo;

    @Column({
        type: 'enum',
        enum: YesNo,
        default: YesNo.NO
    })
    consumptionTax: YesNo;

    @Column({
        type: 'enum',
        enum: YesNo,
        default: YesNo.NO
    })
    sourceWithholdingApply: YesNo;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
    sourceWithholdingPercentage: number;

    @Column({
        type: 'enum',
        enum: YesNo,
        default: YesNo.NO
    })
    reteicaApply: YesNo;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.0 })
    reteicaPercentage: number;

    @Column({
        type: 'enum',
        enum: YesNo,
        default: YesNo.NO
    })
    reteivaApply: YesNo;

    @Column()
    hostId: number;

    @OneToOne(() => HostEntity, host => host.tax)
    @JoinColumn({ name: 'hostId' })
    host: HostEntity;
}