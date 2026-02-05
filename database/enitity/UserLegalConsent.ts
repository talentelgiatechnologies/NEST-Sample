import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";

export enum LegalDocumentType {
    TERMS_OF_SERVICE = 'TERMS_OF_SERVICE',
    DATA_POLICY = 'DATA_POLICY',
}

@Entity('user_legal_consent')
export class UserLegalConsent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @ManyToOne(() => User, user => user.legalConsents)
    user: User;

    @Column({
        type: 'enum',
        enum: LegalDocumentType,
    })
    documentType: LegalDocumentType;

    @Column()
    consentedAt: string;

    @Column()
    version: string;

    @Column()
    ipAddress: string;

    @Column({ type: 'text' })
    consentText: string;

    @Column({ default: false })
    email: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}