import { Module } from '@nestjs/common';
import UserController from '@/controllers/UserController';
import UserService from '@/services/UserService';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export default class UserModule {}
