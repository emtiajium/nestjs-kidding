import { Controller, Get } from '@nestjs/common';
import UserService from '@/services/UserService';

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
}
