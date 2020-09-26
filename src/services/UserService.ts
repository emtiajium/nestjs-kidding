import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import User from '@/data-transfer-object/UserDto';

@Injectable()
export default class HelloService {
  async getUsers(): Promise<User[]> {
    return [
      { id: uuid.v4(), username: 'user1@email.com' },
      { id: uuid.v4(), username: 'user2@email.com' },
    ];
  }
}
