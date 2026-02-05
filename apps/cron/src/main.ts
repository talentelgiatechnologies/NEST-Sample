import { NestFactory } from '@nestjs/core';
import { CronModule } from './cron.module';

async function bootstrap() {
  const app = await NestFactory.create(CronModule);
  await app.listen(process.env['CRON_PORT'] ?? 3000);
}
bootstrap();
