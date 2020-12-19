import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import * as uuid from 'uuid';
import User from '@/data-transfer-object/UserDto';
import users from '@/mocks/users';
import EmailService from '@/services/EmailService';

let userData =  users
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

  async updateUser(id: string, user: User): Promise<User> {
    const targetUser = await users.find(dbUser => dbUser.id === id);
    if (!targetUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST) 
    }
    return targetUser;
  }

  async deleteUser(id: string): Promise<void> {
    const targetUser = await users.find(dbUser => dbUser.id === id);
    if (!targetUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const userIndex = users.findIndex(user => user.id === id);
    await users.splice(userIndex, 1);
  }
}
