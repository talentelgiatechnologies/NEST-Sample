import { NestFactory } from '@nestjs/core';
import { ExperienceModule } from './experience.module';

async function bootstrap() {
  const app = await NestFactory.create(ExperienceModule);
  app.enableCors({ origin: ['http://localhost:5173', 'http://localhost:3000'] })
  app.setGlobalPrefix('api/experience')
  await app.listen(process.env.EXPERIENCE_PORT ?? 3000, '0.0.0.0');
}
bootstrap();
