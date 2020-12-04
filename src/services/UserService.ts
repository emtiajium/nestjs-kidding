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
    // TODO add validation to avoid multiple users with same username
    await this.emailService.sendAccountOpeningEmail(user.username);
    const newUser = {
      ...user,
      id: uuid.v4(),
    };
    users.push(newUser);
    return newUser;
  }

  private findUser(userId: string): User {
    return users.find(user => user.id === userId);
  }

  private isUserExist(userId: string): boolean {
    return !!this.findUser(userId);
  }

  updateUser(user: User): User {
    if (this.isUserExist(user.id) === false) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = Object.assign(user, this.findUser(user.id));
    users[users.findIndex(({ id: userId }) => userId === user.id)] = updatedUser;
    return updatedUser;
  }
}
