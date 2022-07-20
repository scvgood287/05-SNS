import { Get, Res } from '@nestjs/common';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth';
import { LoginGuard, RefreshJWTGuard } from '../auth/guards';
import { CreateUserDTO } from './dto';
import { SignUp, ProtectedUser } from './entities';
import UserService from './user.service';
import { Response, Request } from 'express';
import { CONSTANT_REFRESH } from 'src/constants';
import { responseHandler } from 'src/utils/response';
import { ConfigService } from '@nestjs/config';
import { hash } from 'src/utils/bcrypt';

@ApiTags('user')
@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) {}

  @Post('signUp')
  async signUp(@Res({ passthrough: true }) res: Response, @Body() createUserDTO: CreateUserDTO) {
    const user = await this.userService.signUp(createUserDTO);

    responseHandler(res, {
      json: user,
      statusCode: 201,
      statusMessage: '회원가입에 성공했습니다.',
    });
  }

  @Post('login')
  @UseGuards(LoginGuard)
  async login(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const {
      user: {
        user: { email },
        tokens: { accessToken, refreshToken },
      },
    } = req;

    const hashedRefreshToken = await hash(refreshToken);

    await this.userService.setRefreshToken({ email, hashedRefreshToken });

    responseHandler(res, {
      header: [
        ['Authorization', accessToken],
        [CONSTANT_REFRESH, refreshToken],
      ],
      statusCode: 200,
      statusMessage: '로그인에 성공했습니다.',
    });
  }

  @Get('refreshAccessToken')
  @UseGuards(RefreshJWTGuard)
  async refreshAccessToken(@Res({ passthrough: true }) res: Response, req: Request) {
    const {
      user: {
        user: { email },
        tokens: { accessToken, refreshToken },
      },
    } = req;

    const hashedRefreshToken = await hash(refreshToken);

    await this.userService.setRefreshToken({ email, hashedRefreshToken });

    responseHandler(res, {
      header: [
        ['Authorization', accessToken],
        [CONSTANT_REFRESH, refreshToken],
      ],
      statusCode: 200,
      statusMessage: '토큰 재발급에 성공했습니다.',
    });
  }
}
