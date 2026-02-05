import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";
import { config } from "../../lib/config";
import { Expose } from "class-transformer";

export enum DocumentType {
    LICENSE = "LICENSE",
    ID = "ID"
}

@Entity()
export class UserDocument {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => User, (user) => user.documents, { nullable: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column('uuid')
    userId: string;

    @Column({
        type: "enum",
        enum: DocumentType,
        nullable: false
    })
    documentType: DocumentType;

    @Column({ type: 'varchar', nullable: false })
    document: string;

    @Expose()
      get documentWithUrl(): string {
        const baseUrl = config().DOCUMENT_PATH;
        return this.document ? baseUrl + this.document : null;
      }

    @Column({ type: 'varchar', nullable: false })
    documentMediaType: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}