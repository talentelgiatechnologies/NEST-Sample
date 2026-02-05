import { Module } from '@nestjs/common';
import { CommonCurrencyService } from './common.currency.service';
import { commonCurrencyProviders } from './currency.provider';
import { DatabaseModule } from 'database/database.module';

@Module({
  controllers: [

  ],
  providers: [
    CommonCurrencyService,
    ...commonCurrencyProviders
  ],
  imports: [
    DatabaseModule
  ],
  exports: [
    CommonCurrencyService
  ]
})
export class CommonCurrencyModule {}
