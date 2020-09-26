import { NestFactory } from '@nestjs/core';
import UserModule from '@/modules/UserModule';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('/users', () => {
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

  describe('User controller testing', () => {
    it('should return 200 OK', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect(response => {
          expect(response.body).toBeDefined();
        });
    });

    it('should return 400 BAD REQUEST When username is not an email', () => {
      const payload = {
        username: 'hello',
      };
      return request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(400);
    });
  });
});
