import { Controller, Get } from '@nestjs/common';

@Controller()
export default class User {
  constructor(private readonly userService: User) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }
}
