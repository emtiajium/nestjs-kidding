import { Module } from '@nestjs/common';
import UserController from '@/controllers/UserController';
import UserService from '@/services/UserService';
import EmailService from '@/services/EmailService';

@Module({
  controllers: [UserController],
  providers: [UserService, EmailService],
})
export default class UserModule {}
