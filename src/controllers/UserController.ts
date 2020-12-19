import { Body, Controller, Get, Post, Param, Put, Delete } from '@nestjs/common';
import UserService from '@/services/UserService';
import User from '@/data-transfer-object/UserDto';
import Logged from '@/logger/logged';

@Controller('/users')
export default class UserController {
  // no need to create instance with `new` [this.userService = new UserService();]
  // magic of @Injectable()
  constructor(private readonly userService: UserService) { }

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Post()
  @Logged()
  async createUser(@Body() user: User): Promise<User> {
    return this.userService.createUser(user);
  }

  @Put(':id')
  @Logged()
  async updateUser(@Param('id') id: string, @Body() user: User): Promise<User> {
    return this.userService.updateUser(id, user);
  }

  @Delete(':id')
  @Logged()
  async deleteUser(@Param('id') id: string): Promise<Boolean> {
    return this.userService.deleteUser(id);
  }
}