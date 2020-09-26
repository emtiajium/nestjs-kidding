import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';

interface IUser {
  id: string;
  username: string;
}

@Injectable()
export default class HelloService {
  async getUsers(): Promise<IUser[]> {
    return [
      { id: uuid.v4(), username: 'user1@email.com' },
      { id: uuid.v4(), username: 'user2@email.com' },
    ];
  }
}
