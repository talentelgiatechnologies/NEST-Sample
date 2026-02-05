import { Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtRequest } from 'apps/core/src/auth/auth.dto';
import { multerOptions } from 'lib/multerConfig';
import { UserService } from './user.service';
import { DocumentType } from 'database/enitity/UserDocument.entity';
import { UserAccessGuard } from './auth.access.guard';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Post('profile')
    @UseGuards(UserAccessGuard)
    @UseInterceptors(FileInterceptor('file', multerOptions("PROFILE_PATH")))
    async uploadProfile(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: JwtRequest,
    ) {
        const data = await this.userService.uploadProfile(req.user.id, file);

        return {
            statusCode: 200,
            data
        }
    }

    @Post('document')
    @UseGuards(UserAccessGuard)
    @UseInterceptors(FileInterceptor('file', multerOptions("DOCUMENT_PATH")))
    async uploadDocument(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: JwtRequest,
        @Body('type') type: DocumentType,
    ) {
        const data = await this.userService.uploadDocument(req.user.id, file, type);

        return {
            statusCode: 200,
            data
        }
    }
}
