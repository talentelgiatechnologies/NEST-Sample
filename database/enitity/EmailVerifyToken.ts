import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User.entity';

@Entity()
export class EmailVerifyToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @Column()
  count: number;

  @OneToOne(() => User, (user) => user.emailVerifyToken, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
