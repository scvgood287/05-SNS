import { Module } from '@nestjs/common';
import AuthService from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SignUpStrategy, LoginStrategy, AccessJWTStrategy, RefreshJWTStrategy } from './strategies';
import { UserModule } from '../user';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRESIN },
    }),
    UserModule,
  ],
  providers: [AuthService, SignUpStrategy, LoginStrategy, AccessJWTStrategy, RefreshJWTStrategy],
  exports: [],
})
export default class AuthModule {}
