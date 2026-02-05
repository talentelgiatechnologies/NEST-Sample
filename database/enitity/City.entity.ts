import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ExperienceListingStep5Entity } from './ExperienceListingStep5.entity';
import { CityPolygon } from './CityPolygon.entity';

export enum CityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('city')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  cityName: string;

  @Column({
    type: 'enum',
    enum: CityStatus,
    default: CityStatus.ACTIVE,
  })
  status: CityStatus;

  @OneToMany(() => ExperienceListingStep5Entity, experience => experience.cityData)
  experience: ExperienceListingStep5Entity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CityPolygon, polygon => polygon.city, { cascade: true })
  polygons: CityPolygon[];
}
