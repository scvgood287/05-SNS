import { Module } from '@nestjs/common';
import { UserModule, AuthModule, ConfigsModule, DBModule } from './modules';

@Module({
  imports: [ConfigsModule, DBModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
