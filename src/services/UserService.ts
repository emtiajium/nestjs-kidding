import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as uuid from 'uuid';
import User from '@/data-transfer-object/UserDto';
import users from '@/mocks/users';
import EmailService from '@/services/EmailService';

@Injectable()
export default class UserService {
  constructor(private readonly emailService: EmailService) {}

  async getUsers(): Promise<User[]> {
    return users;
  }

  async createUser(user: User): Promise<User> {
    await this.emailService.sendAccountOpeningEmail(user.username);
    const newUser = {
      ...user,
      id: uuid.v4(),
    };
    users.push(newUser);
    return newUser;
  }

  async updateUser(userId: string, user: User): Promise<User> {
    const targetUser = await users.find(dbUser => dbUser.id === userId);
    if (!targetUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const usernameCheck = await users.find(dbUser => dbUser.username === user.username && dbUser.id !== userId);
    if (usernameCheck) {
      throw new HttpException('Username already exists', HttpStatus.NOT_FOUND);
    }
    targetUser.username = user.username;
    return targetUser;
  }

  async deleteUser(userId: string): Promise<void> {
    const targetUser = await users.find(dbUser => dbUser.id === userId);
    if (!targetUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const userIndex = users.findIndex(user => user.id === userId);
    await users.splice(userIndex, 1);
  }
}
