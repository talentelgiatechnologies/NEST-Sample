import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userProviders } from './user.providers';
import { DatabaseModule } from 'database/database.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    controllers: [UserController],
    providers: [UserService, ...userProviders],
    imports: [
        DatabaseModule,
        JwtModule.register({
            global: true,
        }),
    ],
})
export class UserModule {}
