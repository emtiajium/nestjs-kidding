import HelloModule from '@/modules/HelloModule';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import bootstrap from '@/bootstrap';

describe('/hello', () => {
  let app: INestApplication;
  beforeAll(async () => {
    app = await bootstrap(HelloModule);
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
