import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { AdminUser } from './AdminUser.entity';
import { RoleAccess } from './RoleAccess.entity';

@Entity({ name: 'role', schema: 'momenta' })
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    roleName: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => AdminUser, (adminUser) => adminUser.role)
    adminUsers: AdminUser[];

    @OneToMany(() => RoleAccess, (roleAccess) => roleAccess.role)
    roleAccess: RoleAccess[];
}
