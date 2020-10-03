import { BadRequestException, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import User from '@/data-transfer-object/UserDto';
import { validate } from 'class-validator';
import users from '@/mocks/users';

@Injectable()
export default class UserService {
  async getUsers(): Promise<User[]> {
    return users;
  }

  async createUser(user: User): Promise<User> {
    // very bad approach but ok for now
    const newUser = new User();
    newUser.username = user.username;
    const errors = await validate(newUser);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return {
      ...user,
      id: uuid.v4(),
    };
  }
}
