import UserModule from '@/modules/UserModule';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as uuid from 'uuid';
import EmailService from '@/services/EmailService';
import bootstrap from '@/bootstrap';
import User from '@/data-transfer-object/UserDto';
import UserRepository from '@/mocks/UserRepository';

async function createUser(app, payload): Promise<User> {
  return request(app.getHttpServer())
    .post('/users')
    .send(payload)
    .then(({ body: user }) => user);
}

async function getUsers(app): Promise<User[]> {
  return request(app.getHttpServer())
    .get('/users')
    .then(({ body: users }) => users);
}

function mockSendEmail(): jest.SpyInstance {
  // Object.getPrototypeOf(new EmailService() or EmailService.prototype
  return jest
    .spyOn(EmailService.prototype, 'sendEmail')
    .mockImplementation((): Promise<boolean> => Promise.resolve(true));
}

function backToOriginalSendEmailImplementation(sendEmailMock: jest.SpyInstance): void {
  sendEmailMock.mockRestore();
}

describe('/users', () => {
  let app: INestApplication;

  const findAllUsers = new UserRepository().getAllUsers;

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

    it('should throw 500 INTERNAL SERVER ERROR When Sendgrid credential is invalid', () => {
      const payload = {
        username: 'hello@example.com',
      };
      return request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(500);
    });

    it('should return 201 CREATED When username is an email', () => {
      const numberOfUsersBeforeMakingRequest = findAllUsers().length;
      const sendEmailMock = mockSendEmail();
      const payload = {
        username: 'hello@example.com',
      };
      return request(app.getHttpServer())
        .post('/users')
        .send(payload)
        .expect(201)
        .expect(async ({ body: user }) => {
          expect(user).toBeDefined();
          expect(user.id).toBeDefined();
          expect(!!findAllUsers().find(eachUser => eachUser.username === payload.username)).toBe(true);
          // API request to ensure! haha!!
          const numberOfUsersAfterMakingRequest = (await getUsers(app)).length;
          expect(numberOfUsersAfterMakingRequest).toBe(numberOfUsersBeforeMakingRequest + 1);
          backToOriginalSendEmailImplementation(sendEmailMock);
        });
    });
  });

  describe('PUT /:userId', () => {
    it('SHOULD throw 400 BAD REQUEST When provided username is not an email', () => {
      const payload = {
        username: `I'm not an email`,
      };
      const userId = uuid.v4();
      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send(payload)
        .expect(400);
    });

    it('SHOULD throw 404 NOT FOUND When provided user id does not exist', () => {
      const payload = {
        username: 'hello@example.com',
      };
      const userId = uuid.v4();
      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send(payload)
        .expect(404)
        .expect(response => response.body.message === 'User not found');
    });

    it('SHOULD return 200 OK When provided payload is okay', async () => {
      const payload = {
        username: 'nerddevs@example.com',
      };
      const sendEmailMock = mockSendEmail();
      const createdUser = await createUser(app, payload);
      backToOriginalSendEmailImplementation(sendEmailMock);
      const userId = createdUser.id;
      return request(app.getHttpServer())
        .put(`/users/${userId}`)
        .send(payload)
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.body.id).toBe(userId);
          expect(response.body.username).toBe(payload.username);
        });
    });
  });

  describe('DELETE /:userId', () => {
    it('SHOULD throw 404 NOT FOUND When provided user id does not exist', () => {
      const userId = uuid.v4();
      return request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .expect(404)
        .expect(response => response.body.message === 'User not found');
    });

    it('SHOULD return 200 OK When provided payload is okay', async () => {
      const payload = {
        username: 'nerddevs@example.com',
      };
      const sendEmailMock = mockSendEmail();
      const createdUser = await createUser(app, payload);
      backToOriginalSendEmailImplementation(sendEmailMock);
      const userId = createdUser.id;
      return request(app.getHttpServer())
        .delete(`/users/${userId}`)
        .send()
        .then(response => {
          expect(response.status).toBe(200);
          expect(!!findAllUsers().find(user => user.id === userId)).toBe(false);
        });
    });
  });
});
