import { NestFactory } from '@nestjs/core';
import AppModule from '@/AppModule';

const PORT = 9876;
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap();
