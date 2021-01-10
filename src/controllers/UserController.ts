import { Body, Param, Controller, Get, Post, Put, Delete } from '@nestjs/common';
import UserService from '@/services/UserService';
import User from '@/data-transfer-object/UserDto';
import Logged from '@/logger/logged';

@Controller('/users')
export default class UserController {
  // no need to create instance with `new` [this.userService = new UserService();]
  // magic of @Injectable()
  constructor(private readonly userService: UserService) {}

  @Get()
  @Logged()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Post()
  @Logged()
  async createUser(@Body() user: User): Promise<User> {
    return this.userService.createUser(user);
  }

  @Put(':userId')
  @Logged()
  updateUserById(@Param('userId') userId: string, @Body() user: User): Promise<User> {
    const updatedUser = {
      ...user,
      id: userId,
    };
    return this.userService.updateUserById(userId, updatedUser);
  }

  @Delete(':userId')
  @Logged()
  deleteUserById(@Param('userId') userId: string): Promise<string> {
    return this.userService.deleteUserById(userId);
  }
}
