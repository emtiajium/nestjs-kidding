import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import HelloService from '@/services/HelloService';
import { Response } from 'express';

@Controller('/hello')
export default class HelloController {
  private readonly helloService: HelloService;

  constructor() {
    this.helloService = new HelloService();
  }

  @Get()
  async getHello(@Res() res: Response): Promise<void> {
    const greetings: string = await this.helloService.getHello();
    res.status(HttpStatus.OK).send(greetings);
  }
}
