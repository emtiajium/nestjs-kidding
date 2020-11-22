import { Module } from '@nestjs/common';
import HelloController from '@/controllers/HelloController';

@Module({
  controllers: [HelloController],
})
export default class HelloModule {}
