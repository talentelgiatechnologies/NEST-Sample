import { Inject, Injectable } from '@nestjs/common';
import { USER, USER_DOCUMENT } from 'database/constants';
import { User } from 'database/enitity/User.entity';
import { DocumentType, UserDocument } from 'database/enitity/UserDocument.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER) private userRepository: Repository<User>,
        @Inject(USER_DOCUMENT) private userDocumentRepository: Repository<UserDocument>,
    ) { }
    async uploadProfile(userId: string, file: Express.Multer.File) {
        await this.userRepository.update({
            id: userId
        }, {
            profilePicture: file.filename
        })

        return file;
    }

    async uploadDocument(userId: string, file: Express.Multer.File, type: DocumentType) {
        const document = await this.userDocumentRepository.findOne({
            where: {
                userId,
                documentType: type
            }
        })

        if (document) {
            await this.userDocumentRepository.delete({
                id: document.id
            })
        }

        if (file) {
            const userDocument = this.userDocumentRepository.create({
                userId,
                document: file.filename,
                documentType: type,
                documentMediaType: file.mimetype
            })

            await this.userDocumentRepository.save(userDocument)
        }
    }
}
