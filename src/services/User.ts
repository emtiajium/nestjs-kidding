import { Injectable } from '@nestjs/common';

@Injectable()
export default class User {
  getHello(): string {
    return 'Hello World!';
  }
}
