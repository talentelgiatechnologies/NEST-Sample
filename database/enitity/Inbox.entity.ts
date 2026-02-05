import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Index,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { User } from './User.entity';
import { Message } from './Message.entity';

@Entity('inbox')
export class Inbox {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => User, (user) => user.guestInboxes, { nullable: false })
    @JoinColumn({ name: 'guestId' })
    guest: User;

    @Column('uuid')
    guestId: string;

    @ManyToOne(() => User, (user) => user.hostInboxes, { nullable: false })
    @JoinColumn({ name: 'hostId' })
    host: User;

    @Column('uuid')
    hostId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    lastMessage: Message;

    @OneToMany(() => Message, (message) => message.inbox)
    messages: Message[];
}
