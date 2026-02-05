import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DisputesChatEntity } from "./DisputesChat.entity";

@Entity('disputes_chat_media')
export class DisputesChatMediaEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    disputeChatId: number;

    @ManyToOne(() => DisputesChatEntity, disputeChat => disputeChat.files)
    @JoinColumn({ name: 'disputeChatId' })
    disputeChat: DisputesChatEntity;

    @Column()
    fileName: string;

    @Column()
    fileType: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}