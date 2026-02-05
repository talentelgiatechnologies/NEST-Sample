import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    Index,
  } from 'typeorm';
  import { Role } from './Role.entity';
  import { AdminUserSession } from './AdminUserSession.entity';
  
  @Entity('admin_user')
  @Index('AdminUser_roleId_fkey', ['roleId'])
  export class AdminUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ unique: true })
    username: string;
  
    @Column()
    password: string;
  
    @Column()
    roleId: number;
  
    @Column({ default: true })
    isActive: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @ManyToOne(() => Role, (role) => role.adminUsers, { onDelete: 'CASCADE' })
    role: Role;
  
    @OneToMany(() => AdminUserSession, (session) => session.adminUser)
    adminUserSessions: AdminUserSession[];
  }
  