import { Body, Controller, Get, Post } from '@nestjs/common';
import UserService from '@/services/UserService';
import * as uuid from 'uuid';

interface IUser {
  id: string;
  username: string;
}

@Controller('/users')
export default class HelloController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<IUser[]> {
    return this.userService.getUsers();
  }

  @Post()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async createUser(@Body() user: IUser): Promise<string> {
    // TODO pass ${user} to the service
    return uuid.v4();
  }
}
