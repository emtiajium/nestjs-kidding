import { Body, Controller, Get, Post } from '@nestjs/common';
import UserService from '@/services/UserService';
import User from '@/data-transfer-object/UserDto';
import * as uuid from 'uuid';

@Controller('/users')
export default class HelloController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Post()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createUser(@Body() user: User): Promise<User> {
    // TODO pass ${user} to the service
    return {
      ...user,
      id: uuid.v4(),
    };
  }
}
