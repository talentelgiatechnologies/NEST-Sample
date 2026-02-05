import { NestFactory } from '@nestjs/core';
import { UploadModule } from './upload.module';

async function bootstrap() {
  const app = await NestFactory.create(UploadModule);
  await app.listen(process.env.UPLOAD_PORT ?? 3781);
}
bootstrap();
