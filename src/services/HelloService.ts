import { Injectable } from '@nestjs/common';

@Injectable()
export default class HelloService {
  getHello(): string {
    return 'Hello, World!';
  }
}
