import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHERS = 'others',
  NOTTOSAY = 'nottosay'
}

@Entity()
export class UserProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    userId: string;

    @ManyToOne(() => User, (user) => user.profile)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    dob: string;

    @Column({ type: 'enum', enum: Gender, nullable: true })
    gender: Gender;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}