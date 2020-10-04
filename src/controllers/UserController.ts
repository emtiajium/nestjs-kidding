import { Body, Controller, Get, Post } from '@nestjs/common';
import UserService from '@/services/UserService';
import User from '@/data-transfer-object/UserDto';

@Controller('/users')
export default class UserController {
  // no need to create instance with `new` [this.userService = new UserService();]
  // magic of @Injectable()
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Post()
  async createUser(@Body() user: User): Promise<User> {
    return this.userService.createUser(user);
  }
}
