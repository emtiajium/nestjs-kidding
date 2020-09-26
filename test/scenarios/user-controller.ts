import { NestFactory } from '@nestjs/core';
import UserModule from '@/modules/User';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('UserController', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const PORT = 9877;
    async function bootstrap(): Promise<void> {
      app = await NestFactory.create(UserModule);
      await app.listen(PORT);
    }
    await bootstrap();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect(response => {
          expect(response.text).toBe('Hello World!');
        });
    });
  });
});
