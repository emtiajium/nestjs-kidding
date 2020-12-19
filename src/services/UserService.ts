import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as uuid from 'uuid';
import User from '@/data-transfer-object/UserDto';
import users from '@/mocks/users';
import EmailService from '@/services/EmailService';
let usersData = users;
@Injectable()
export default class UserService {
  constructor(private readonly emailService: EmailService) { }

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
    const { username } = user;
    const updatedUser = await usersData.find(obj => obj.id === id);
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    // save data
    usersData = usersData.map(obj => {
      if (obj.id === id) {
        obj = { ...obj, username }
      }
      return obj;
    });
    return user;
  }

  async deleteUser(id: string): Promise<Boolean> {
    const deletingUser = await usersData.find(obj => obj.id === id);
    if (!deletingUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    // delete data
    usersData = usersData.filter(obj => obj.id !== id);
    console.log(usersData);
    return true;
  }
}
