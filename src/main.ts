import { NestFactory } from '@nestjs/core';
import AppModule from '@/AppModule';
import { INestApplication } from '@nestjs/common';

const PORT = 9876;
async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap();
