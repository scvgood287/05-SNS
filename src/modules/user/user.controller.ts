import { Body, Controller, Post, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth';
import { CreateUserDTO } from './dto';
import { SignUpResponse } from './responses';

@ApiTags('user')
@Controller('user')
export default class UserController {}
