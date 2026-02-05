import { Module } from '@nestjs/common';
import { CronController } from './cron.controller';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local', '.env.development'],
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    TasksModule
  ],
  controllers: [CronController],
  providers: [CronService],
})
export class CronModule { }
