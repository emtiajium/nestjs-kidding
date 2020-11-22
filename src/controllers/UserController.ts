import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import UserService from '@/services/UserService';
import User from '@/data-transfer-object/UserDto';
import EmailException from '@/exceptions/EmailException';

@Controller('/users')
export default class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  @Get()
  async getUsers(@Res() res: Response): Promise<void> {
    const users: User[] = await this.userService.getUsers();
    res.status(HttpStatus.OK).send(users);
  }

  @Post()
  async createUser(@Body() user: User, @Res() res: Response): Promise<void> {
    let createdUser: User;
    try {
      createdUser = await this.userService.createUser(user);
      res.status(HttpStatus.CREATED).send(createdUser);
    } catch (error) {
      res
        .status(error instanceof EmailException ? HttpStatus.INTERNAL_SERVER_ERROR : HttpStatus.BAD_REQUEST)
        .send(error);
    }
  }
}
