import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    Index,
  } from 'typeorm';
  import { Role } from './Role.entity';
  
  @Entity('role_access')
  @Index('RoleAccess_roleId_fkey', ['roleId'])
  export class RoleAccess {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    roleId: number;
  
    @Column()
    menuId: string;
  
    @ManyToOne(() => Role, (role) => role.roleAccess, { onDelete: 'CASCADE' })
    role: Role;
  }
  