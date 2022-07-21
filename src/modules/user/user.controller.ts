import { Body, Controller, Post, Get, Res, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignUpGuard, LoginGuard, RefreshJWTGuard } from '../auth/guards';
import { CreateUserDTO, LoginDTO } from './dto';
import UserService from './user.service';
import { Response, Request } from 'express';
import { CONSTANT_ACCESS, CONSTANT_REFRESH } from 'src/constants';
import { defaultTokenCookieOption, responseHandler } from 'src/utils/response';
import { hash } from 'src/utils/bcrypt';

@ApiTags('users')
@Controller('users')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signUp')
  @UseGuards(SignUpGuard)
  @ApiBody({ type: CreateUserDTO })
  @ApiOperation({ description: '유저 회원가입 API 입니다.', summary: '유저 회원가입' })
  async signUp(@Res({ passthrough: true }) res: Response, @Body() createUserDTO: CreateUserDTO) {
    const user = await this.userService.signUp(createUserDTO);

    responseHandler(res, {
      json: user,
      statusCode: 201,
    });
  }

  @Post('login')
  @UseGuards(LoginGuard)
  @ApiBearerAuth('Authorization')
  @ApiBody({ type: LoginDTO })
  @ApiOperation({ description: '유저 로그인 API 입니다.', summary: '유저 로그인' })
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
      cookie: [
        [CONSTANT_ACCESS, accessToken, defaultTokenCookieOption(true)],
        [CONSTANT_REFRESH, refreshToken, defaultTokenCookieOption(false)],
      ],
      statusCode: 200,
    });
  }

  @Get('refreshAccessToken')
  @UseGuards(RefreshJWTGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ description: '유저 토큰 재발급 API 입니다.', summary: '유저 토큰 재발급' })
  async refreshAccessToken(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const {
      user: {
        user: { email },
        tokens: { accessToken, refreshToken },
      },
    } = req;

    const hashedRefreshToken = await hash(refreshToken);

    await this.userService.setRefreshToken({ email, hashedRefreshToken });

    responseHandler(res, {
      cookie: [
        [CONSTANT_ACCESS, accessToken, defaultTokenCookieOption(true)],
        [CONSTANT_REFRESH, refreshToken, defaultTokenCookieOption(false)],
      ],
      statusCode: 200,
    });
  }
}
