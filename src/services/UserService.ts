import { Injectable, NotFoundException } from '@nestjs/common';
import User from '@/data-transfer-object/UserDto';
import EmailService from '@/services/EmailService';
import UserRepository from '@/mocks/UserRepository';

@Injectable()
export default class UserService {
  private readonly userRepository: UserRepository = new UserRepository();

  constructor(private readonly emailService: EmailService) {}

  async getUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async createUser(user: User): Promise<User> {
    // TODO add validation to avoid multiple users with same username
    await this.emailService.sendAccountOpeningEmail(user.username);
    return this.userRepository.addUser(user);
  }

  private isUserExist(userId: string): boolean {
    return !!this.userRepository.findUser(userId);
  }

  updateUser(user: User): User {
    if (this.isUserExist(user.id) === false) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.updateUser(user);
  }

  removeUser(userId: string): void {
    if (this.isUserExist(userId) === false) {
      throw new NotFoundException('User not found');
    }
    this.userRepository.removeUser(userId);
  }
}
