import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DisputeEntity } from "./Disputes.entity";
import { DisputesChatMediaEntity } from "./DisputesChatMedia.entity";

export enum SenderType {
    GUEST = "guest",
    ADMIN = "admin",
    HOST = "host"
}

@Entity('disputes_chat')
export class DisputesChatEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    disputeId: number;

    @ManyToOne(() => DisputeEntity, dispute => dispute.chats)
    @JoinColumn({ name: 'disputeId' })
    dispute: DisputeEntity;

    @Column()
    message: string;

    @Column({
        type: 'enum',
        enum: SenderType,
        default: SenderType.GUEST
    })
    sender: SenderType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => DisputesChatMediaEntity, media => media.disputeChat)
    files: DisputesChatMediaEntity[];
}