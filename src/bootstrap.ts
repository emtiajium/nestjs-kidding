import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';

const PORT = 0;
async function bootstrap(module: any): Promise<INestApplication> {
  const app = await NestFactory.create(module);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
  const url = await app.getUrl();
  console.log(`URL: ${url.replace('[::1]', 'localhost')}`);
  return app;
}

export default bootstrap;
