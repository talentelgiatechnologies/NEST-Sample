import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { taskProviders } from './tasks.providers';
import { DatabaseModule } from 'database/database.module';
import { CommonCurrencyModule } from 'lib/common/currency/currency.module';

@Module({
  providers: [
    TasksService,
    ...taskProviders,
  ],
  imports: [
    DatabaseModule,
    CommonCurrencyModule
  ]
})
export class TasksModule { }
