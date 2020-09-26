import { Module } from '@nestjs/common';
import HelloModule from '@/modules/HelloModule';
import UserModule from '@/modules/UserModule';

@Module({
  imports: [HelloModule, UserModule],
})
export default class AppModule {}
