import { NestFactory } from '@nestjs/core';
import UserModule from '@/modules/UserModule';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import EmailService from '@/services/EmailService';

jest.setTimeout(10000);
jest.mock('@/services/EmailService');

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

  // beforeEach(() => {
  //   (EmailService as jest.Mock).mockClear();
  // });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /', () => {
    it('should return 200 OK', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect(response => {
          expect(response.body).toBeDefined();
        });
    });
  });

  describe('POST /', () => {
    it('should return 400 BAD REQUEST When username is not an email', () => {
      const payload = {
        username: 'hello',
      };
      return request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(400);
    });

    it.skip('should throw 500 INTERNAL SERVER ERROR When Sendgrid credential is missing', () => {
      const payload = {
        username: 'hello@example.com',
      };
      return request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(500);
    });

    it('should return 201 CREATED When username is an email', () => {
      (EmailService as jest.Mock).mockImplementationOnce(() => ({
        sendEmail: (): Promise<boolean> => Promise.resolve(true),
        sendAccountOpeningEmail: (): Promise<boolean> => Promise.resolve(true),
      }));
      const payload = {
        username: 'hello@example.com',
      };
      return request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(201)
        .expect(({ body: user }) => {
          expect(user).toBeDefined();
          expect(user.id).toBeDefined();
        });
    });
  });
});
