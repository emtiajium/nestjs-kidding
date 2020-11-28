import { NestFactory } from '@nestjs/core';
import HelloModule from '@/modules/HelloModule';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('/hello', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const PORT = 0;
    async function bootstrap(): Promise<void> {
      app = await NestFactory.create(HelloModule);
      await app.listen(PORT);
    }
    await bootstrap();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /', () => {
    it('should return "Hello, World!"', () => {
      return request(app.getHttpServer())
        .get('/hello')
        .expect(200)
        .expect(response => {
          expect(response.text).toBe('Hello, World!');
        });
    });
  });
});
