import { Injectable, NotFoundException } from '@nestjs/common';
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

  async updateUserById(userId: string, user: User): Promise<User> {
    const userIndex = users.findIndex(item => item.id === userId);

    if (userIndex === -1) {
      throw new NotFoundException();
    }
    users[userIndex] = user;
    return users[userIndex];
  }

  async deleteUserById(userId: string): Promise<string> {
    const userIndex = users.findIndex(item => item.id === userId);

    if (userIndex === -1) {
      throw new NotFoundException();
    }

    return `${users[userIndex].username} has been deleted`;
  }
}
