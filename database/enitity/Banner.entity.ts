import { Expose } from 'class-transformer';
import { config } from '../../lib/config';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('banner')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  image: string;

  @Expose()
  get imageWithUrl(): string {
    const baseUrl = config().SITE_PATH;
    return this.image ? baseUrl + this.image : null;
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


}
