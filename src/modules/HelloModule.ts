import { Module } from '@nestjs/common';
import HelloController from '@/controllers/HelloController';
import HelloService from '@/services/HelloService';

@Module({
  controllers: [HelloController],
  providers: [HelloService],
})
export default class HelloModule {}
