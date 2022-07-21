import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CONSTANT_USER_AUTHORIZE } from 'src/constants';

@Injectable()
export default class UserAuthorizeGuard extends AuthGuard(CONSTANT_USER_AUTHORIZE) {}
