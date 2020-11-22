import { Controller, Get } from '@nestjs/common';
import HelloService from '@/services/HelloService';

@Controller('/hello')
export default class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get()
  getHello(): string {
    return this.helloService.getHello();
  }
}
