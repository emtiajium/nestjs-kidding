import { Module } from '@nestjs/common';
import UserController from '@/controllers/User';
import UserService from '@/services/User';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export default class User {}
