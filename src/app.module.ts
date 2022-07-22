import { Module } from '@nestjs/common';
import { UserModule, AuthModule, ConfigsModule, DBModule, PostModule } from './modules';

@Module({
  imports: [ConfigsModule, DBModule, UserModule, PostModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
