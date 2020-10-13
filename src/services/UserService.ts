import { BadRequestException, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import User from '@/data-transfer-object/UserDto';
import { validate } from 'class-validator';
import users from '@/mocks/users';
import EmailService from '@/services/EmailService';

@Injectable()
export default class UserService {
  constructor(private readonly emailService: EmailService) {}

  async getUsers(): Promise<User[]> {
    return users;
  }

  async createUser(user: User): Promise<User> {
    await this.validateCreateUser(user);
    await this.emailService.sendAccountOpeningEmail(user.username);
    const newUser = {
      ...user,
      id: uuid.v4(),
    };
    users.push(newUser);
    return newUser;
  }

  async validateCreateUser(user: User): Promise<boolean> {
    // very bad approach but ok for now
    const newUser = new User();
    newUser.username = user.username;
    const errors = await validate(newUser);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return true;
  }
}
