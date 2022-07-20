import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CONSTANT_ACCESS_JWT } from 'src/constants';
import AuthService from '../auth.service';
import Payload from '../entities/payload.entity';

@Injectable()
export default class AccessJWTStrategy extends PassportStrategy(Strategy, CONSTANT_ACCESS_JWT) {
  constructor(private authService: AuthService) {
    super({
      //Request에서 JWT 토큰을 추출하는 방법을 설정 -> Authorization에서 Bearer Token에 JWT 토큰을 담아 전송해야한다.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //true로 설정하면 Passport에 토큰 검증을 위임하지 않고 직접 검증, false는 Passport에 검증 위임
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    });
  }

  async validate({ email }: Payload) {
    try {
      const user = await this.authService.validateEmail(email);

      return user;
    } catch (err) {
      throw err;
    }
  }
}
