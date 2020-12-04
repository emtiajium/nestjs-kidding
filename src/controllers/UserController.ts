import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import UserService from '@/services/UserService';
import User from '@/data-transfer-object/UserDto';
import Logged from '@/logger/logged';

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
  @Logged()
  async createUser(@Body() user: User): Promise<User> {
    return this.userService.createUser(user);
  }

  @Put('/:userId')
  updateUser(@Param('userId') userId: string, @Body() user: User): User {
    return this.userService.updateUser({
      ...user,
      id: userId,
    });
  }

  @Delete('/:userId')
  removeUser(@Param('userId') userId: string): void {
    return this.userService.removeUser(userId);
  }
}
