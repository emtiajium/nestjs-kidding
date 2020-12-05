import { Body, Param, Controller, HttpCode, Get, Post, Put, Delete, HttpStatus } from '@nestjs/common';
import UserService from '@/services/UserService';
import User from '@/data-transfer-object/UserDto';
import Logged from '@/logger/logged';
import logged from '@/logger/logged';

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

  @Put(':userId')
  @Logged()
  async updateUser(@Param('userId') userId: string, @Body() user: User): Promise<User> {
    return this.userService.updateUser(userId, user);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @logged()
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    return this.userService.deleteUser(userId);
  }
}
