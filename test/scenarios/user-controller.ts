import UserModule from '@/modules/UserModule';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import EmailService from '@/services/EmailService';
import bootstrap from '@/bootstrap';
import * as uuid from 'uuid';
import users from '@/mocks/users';

describe('/users', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await bootstrap(UserModule);
  });

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

    it('should throw 500 INTERNAL SERVER ERROR When Sendgrid credential is missing', () => {
      const payload = {
        username: 'hello@example.com',
      };
      return request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(500);
    });

    it('should return 201 CREATED When username is an email', () => {
      const sendEmailMock: jest.SpyInstance = jest
        .spyOn(EmailService.prototype, 'sendEmail')
        .mockImplementation((): Promise<boolean> => Promise.resolve(true));
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
          sendEmailMock.mockRestore();
        });
    });
  });

  describe('PUT /:userId', () => {
    const userId = uuid.v4();
    const userIndex = 0;

    it('should return 400 BAD REQUEST When username is not an email', () => {
      const payload = {
        username: 'hello',
      };
      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send(payload)
        .expect(400);
    });

    it('should return 404 NOT FOUND When userId is not present in database', () => {
      const payload = {
        username: 'hello@example.com',
      };
      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send(payload)
        .expect(404);
    });

    it('should return 200 OK When username is an email & userId is present in database', () => {
      const payload = {
        username: 'hello@example.com',
      };
      return request(app.getHttpServer())
        .put(`/users/${users[userIndex].id}`)
        .send(payload)
        .expect(200)
        .expect(({ body: user }) => {
          expect(user).toBeDefined();
          expect(user.id).toBe(users[userIndex].id);
          expect(user.username).toBe(payload.username);
        });
    });
  });

  describe('DELETE /:userId', () => {
    const userId = uuid.v4();
    const userIndex = 0;

    it('should return 404 NOT FOUND When userId is not present in database', () => {
      return request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .expect(404);
    });

    it('should return 200 OK When userId is present in database', () => {
      return request(app.getHttpServer())
        .delete(`/users/${users[userIndex].id}`)
        .expect(200)
        .expect(response => {
          expect(response.text).toBe(`${users[userIndex].username} has been deleted`);
        });
    });
  });
});
