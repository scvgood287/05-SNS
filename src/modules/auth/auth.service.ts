import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../user';
import bcrypt from 'bcrypt';
import { UserAlreadyExists, UserNotFound, WrongPassword } from 'src/status/error';
import { BadRequestException } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.schema';

@Injectable()
export default class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateEmail(email: string): Promise<User> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException(UserNotFound.message);
    }

    return user;
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    const isCorrectPassword = await bcrypt.compare(password, hashedPassword);

    if (!isCorrectPassword) {
      throw new BadRequestException(WrongPassword.message);
    }

    return isCorrectPassword;
  }

  async validateRefreshToken(refreshToken: string, hashedRefreshToken: string): Promise<boolean> {
    const isCorrectRefreshToken = await bcrypt.compare(refreshToken, hashedRefreshToken);

    if (!isCorrectRefreshToken) {
      throw new UnauthorizedException();
    }

    return isCorrectRefreshToken;
  }

  createAccessToken(email: string): string {
    const accessToken = this.jwtService.sign(
      { email },
      {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET_KEY'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRESIN'),
      },
    );

    return accessToken;
  }

  createRefreshToken(email: string): string {
    const refreshToken = this.jwtService.sign(
      { email },
      {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET_KEY'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRESIN'),
      },
    );

    return refreshToken;
  }
}
