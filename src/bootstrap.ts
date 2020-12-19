import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import HelloModule from '@/modules/HelloModule';
import UserModule from '@/modules/UserModule';
import AppModule from '@/AppModule';

type Module = AppModule | HelloModule | UserModule;

async function bootstrap(module: Module, port = 0): Promise<INestApplication> {
  const app: INestApplication = await NestFactory.create(module);
  // to avoid putting @UsePipes(new ValidationPipe()) at every route
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  const url = await app.getUrl();
  console.log(`URL: ${url.replace('[::1]', 'localhost')}`);
  return app;
}

export default bootstrap;
