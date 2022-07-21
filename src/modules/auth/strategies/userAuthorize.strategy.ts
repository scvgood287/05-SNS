import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CONSTANT_USER_AUTHORIZE } from 'src/constants';
import { Request } from 'express';
import { UnAuthorizedUser } from 'src/status/error';

@Injectable()
export default class UserAuthorizeStrategy extends PassportStrategy(Strategy, CONSTANT_USER_AUTHORIZE) {
  constructor() {
    super({ passReqToCallback: true });
  }

  async validate(req: Request) {
    const {
      // user 는 이전 AccessJWTStrategy 에서 decodeToken payload 이다
      user: { user },
      params: { email },
    } = req;

    console.log(user);
    console.log(email);

    if (user.email !== email) {
      throw new ForbiddenException(UnAuthorizedUser.message);
    }

    return user;
  }
}
