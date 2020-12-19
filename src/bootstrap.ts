import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';

async function bootstrap(module: any, port = 0): Promise<INestApplication> {
  const app: INestApplication = await NestFactory.create(module);
  // to avoid putting @UsePipes(new ValidationPipe()) at every route
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  const url = await app.getUrl();
  console.log(`URL: ${url.replace('[::1]', 'localhost')}`);
  return app;
}

export default bootstrap;
