import { NestFactory } from '@nestjs/core';
import UserModule from '@/modules/User';

const PORT = 9876;
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(UserModule);
  await app.listen(PORT);
}
bootstrap();
