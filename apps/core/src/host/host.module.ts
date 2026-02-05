import { Module } from '@nestjs/common';
import { HostService } from './host.service';
import { HostController } from './host.controller';
import { hostProviders } from './host.providers';

@Module({
  controllers: [HostController],
  providers: [
    HostService,
    ...hostProviders
  ],
})
export class HostModule {}
