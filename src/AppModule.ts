import { Module } from '@nestjs/common';
import HelloModule from '@/modules/HelloModule';

@Module({
  imports: [HelloModule],
})
export default class AppModule {}
