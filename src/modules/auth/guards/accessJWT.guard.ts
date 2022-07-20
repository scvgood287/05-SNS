import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CONSTANT_ACCESS_JWT } from 'src/constants';

@Injectable()
export default class AccessJWTGuard extends AuthGuard(CONSTANT_ACCESS_JWT) {}
