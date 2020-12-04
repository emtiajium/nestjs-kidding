import { Injectable, NotFoundException } from '@nestjs/common';
import User from '@/data-transfer-object/UserDto';
import { getAllUsers, findUser, addUser, updateUser, removeUser } from '@/mocks/users';
import EmailService from '@/services/EmailService';

@Injectable()
export default class UserService {
  constructor(private readonly emailService: EmailService) {}

  async getUsers(): Promise<User[]> {
    return getAllUsers();
  }

  async createUser(user: User): Promise<User> {
    // TODO add validation to avoid multiple users with same username
    await this.emailService.sendAccountOpeningEmail(user.username);
    return addUser(user);
  }

  private isUserExist(userId: string): boolean {
    return !!findUser(userId);
  }

  updateUser(user: User): User {
    if (this.isUserExist(user.id) === false) {
      throw new NotFoundException('User not found');
    }
    return updateUser(user);
  }

  removeUser(userId: string): void {
    if (this.isUserExist(userId) === false) {
      throw new NotFoundException('User not found');
    }
    removeUser(userId);
  }
}
