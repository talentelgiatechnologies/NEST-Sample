import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FeeType } from "./ServiceFee.entity";
import { ExperienceCategoriesEntity } from "./ExperienceCategories.entity";

@Entity("category_service_fee")
export class CategoryServiceFee {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExperienceCategoriesEntity, (category) => category.serviceFee)
    @JoinColumn({ name: 'categoryId' })
    category: ExperienceCategoriesEntity;

    @Column()
    categoryId: string;

    @Column({ type: 'float' })
    serviceFee: number;

    @Column({ type: 'enum', enum: FeeType, default: FeeType.PERCENTAGE })
    feeType: FeeType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}