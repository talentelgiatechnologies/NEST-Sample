import { Expose } from 'class-transformer';
import { config } from '../../lib/config';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ExperienceCategoriesEntity } from './ExperienceCategories.entity';
import { ExperienceListingEntity } from './Experience.entity';

@Entity('experience_sub_category')
export class ExperienceSubCategoriesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    image: string;

    @Expose()
    get imageWithUrl(): string {
        const baseUrl = config().EXPERIENCE_PATH;
        return this.image ? baseUrl + this.image : null;
    }

    @Column({ unique: true })
    subCategoryName: string;

    @Column()
    categoryId: number;

    @ManyToOne(() => ExperienceCategoriesEntity, category => category)
    @JoinColumn({ name: 'categoryId' })
    category: ExperienceCategoriesEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => ExperienceListingEntity, experienceListings => experienceListings.subCategory)
    experienceListings: ExperienceListingEntity[];
}
