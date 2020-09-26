import { Module } from '@nestjs/common';
import { User as UserController } from '@/controllers/User';
import { User as UserService } from '@/services/User';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
