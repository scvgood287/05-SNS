import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { CONSTANT_REFRESH_JWT } from 'src/constants';
import AuthService from '../auth.service';
import Payload from '../entities/payload.entity';
import { Tokens } from '../entities';

@Injectable()
export default class RefreshJWTStrategy extends PassportStrategy(Strategy, CONSTANT_REFRESH_JWT) {
  constructor(private authService: AuthService) {
    super({
      //Request에서 JWT 토큰을 추출하는 방법을 설정 -> Authorization에서 Bearer Token에 JWT 토큰을 담아 전송해야한다.
      jwtFromRequest: ExtractJwt.fromHeader('Refresh'),
      // true로 설정하면 Passport에 토큰 검증을 위임하지 않고 직접 검증, false는 Passport에 검증 위임
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  async validate(req, { email }: Payload): Promise<Tokens> {
    try {
      const user = await this.authService.validateEmail(email);
      await this.authService.validateRefreshToken(req.headers.Refresh, user.hashedRefreshToken);

      const accessToken = this.authService.createAccessToken(email);
      const refreshToken = this.authService.createRefreshToken(email);

      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw err;
    }
  }
}
