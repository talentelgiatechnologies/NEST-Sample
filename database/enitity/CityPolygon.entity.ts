import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { City } from './City.entity';

@Entity('city_polygon')
export class CityPolygon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float' })
  lat: number;

  @Column({ type: 'float' })
  lng: number;

  @Column()
  cityId: number;

  @ManyToOne(() => City, (city) => city.polygons, { onDelete: 'CASCADE' })
  city: City;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
