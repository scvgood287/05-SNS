import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CONSTANT_REFRESH_JWT } from 'src/constants';

@Injectable()
export default class RefreshJWTGuard extends AuthGuard(CONSTANT_REFRESH_JWT) {}
