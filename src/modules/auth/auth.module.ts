import { Module } from '@nestjs/common';
import AuthService from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessJWTStrategy, LoginStrategy, RefreshJWTStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRESIN },
    }),
  ],
  providers: [AuthService, AccessJWTStrategy, LoginStrategy, RefreshJWTStrategy],
  exports: [],
})
export default class AuthModule {}
