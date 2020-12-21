import UserModule from '@/modules/UserModule';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import EmailService from '@/services/EmailService';
import bootstrap from '@/bootstrap';
import User from '@/data-transfer-object/UserDto';
import users from '@/mocks/users';
import * as uuid from 'uuid';

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

  describe('PUT', () => {
    const targetUser: User = { username: 'delwar@example.com', id: uuid.v4() };
    beforeAll(() => {
      users.push(targetUser);
    });

    afterAll(() => {
      const userIndex = users.findIndex(user => user.id === targetUser.id);
      users.splice(userIndex, 1);
    });

    it('should update username', () => {
      const payload = {
        username: 'delwar2@example.com',
      };
      return request(app.getHttpServer())
        .put(`/users/${targetUser.id}`)
        .send(payload)
        .expect(200)
        .expect(response => {
          const updatedUser = response.body;
          expect(updatedUser).toBeDefined();
          expect(updatedUser.username).toEqual('delwar2@example.com');
        });
    });
    it('should not update username- username already exists', () => {
      const payload = {
        username: 'user1@example.com',
      };
      return request(app.getHttpServer())
        .put(`/users/${targetUser.id}`)
        .send(payload)
        .expect(409)
        .expect(response => {
          const errorDetail = response.body;
          expect(errorDetail.statusCode).toBe(409);
          expect(errorDetail.message).toEqual('Username already exists');
        });
    });

    it('should not update username- User not found', () => {
      const payload = {
        username: 'delwar2@example.com',
      };
      return request(app.getHttpServer())
        .put(`/users/${uuid.v4()}`)
        .send(payload)
        .expect(404)
        .expect(response => {
          const errorDetail = response.body;
          expect(errorDetail.statusCode).toBe(404);
          expect(errorDetail.message).toEqual('User not found');
        });
    });
  });

  describe('Delete', () => {
    const targetUser: User = { username: 'delwar@example.com', id: uuid.v4() };
    beforeAll(() => {
      users.push(targetUser);
    });

    afterAll(() => {
      const userIndex = users.findIndex(user => user.id === targetUser.id);
      users.splice(userIndex, 1);
    });

    it('should not delete user: user not found', () => {
      return request(app.getHttpServer())
        .delete(`/users/${uuid.v4()}`)
        .expect(400)
        .expect(response => {
          const errorDetail = response.body;
          expect(errorDetail.statusCode).toBe(400);
          expect(errorDetail.message).toEqual('User not found');
        });
    });

    it('should delete user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${targetUser.id}`)
        .expect(204)
        .expect(response => {
          expect(response.body).toEqual({});
        });
    });
  });
});
