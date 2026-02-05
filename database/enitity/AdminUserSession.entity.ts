import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Index,
  } from 'typeorm';
  import { AdminUser } from './AdminUser.entity';
  
  @Entity('admin_user_session')
  @Index('AdminUserSession_adminUserId_fkey', ['adminUserId'])
  export class AdminUserSession {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    adminUserId: string;
  
    @Column({ unique: true, length: 255 })
    token: string;
  
    @Column({ nullable: true })
    ipAddress: string;
  
    @Column({ nullable: true })
    userAgent: string;
  
    @Column({ default: true, type: 'smallint' })
    isValid: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @ManyToOne(() => AdminUser, (adminUser) => adminUser.adminUserSessions, {
      onDelete: 'CASCADE',
    })
    adminUser: AdminUser;
  }
  