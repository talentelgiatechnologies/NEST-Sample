import { Expose } from 'class-transformer';
import { config } from '../../lib/config';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ExperienceSubCategoriesEntity } from './ExperienceSubCategories.entity';
import { ExperienceListingEntity } from './Experience.entity';
import { CouponCode } from './CouponCode.entity';
import { CategoryServiceFee } from './CategoryServiceFee.entity';

@Entity('experience_category')
export class ExperienceCategoriesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 1 })
    isActive: number;

    @Column()
    image: string;

    @Expose()
    get imageWithUrl(): string {
        const baseUrl = config().EXPERIENCE_PATH;
        return this.image ? baseUrl + this.image : null;
    }

    @Column({ unique: true })
    categoryName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => ExperienceSubCategoriesEntity, subCategory => subCategory.category)
    subCategory: ExperienceSubCategoriesEntity[];

    @OneToMany(() => CouponCode, coupons => coupons.category)
    coupons: CouponCode[];

    @OneToMany(() => ExperienceListingEntity, experienceListings => experienceListings.category)
    experienceListings: ExperienceListingEntity[];

    @OneToMany(() => CategoryServiceFee, serviceFee => serviceFee.category)
    serviceFee: CategoryServiceFee[];
}
