import { Controller, Param, Put, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessJWTGuard } from '../auth/guards';
import { Response, Request } from 'express';
import { responseHandler } from 'src/utils/response';
import LikeService from './like.service';
import { CONSTANT_ACCESS } from 'src/constants';
import { UnAuthorizedToken, UserNotFound } from 'src/status/error';
import { LikeCreatedResponse, LikeNoContentResponse, UnlikeResponse } from 'src/status/success';

@ApiTags('likes')
@Controller('likes')
export default class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Put('/like/:postId')
  @UseGuards(AccessJWTGuard)
  // swagger
  @ApiCookieAuth(CONSTANT_ACCESS)
  @ApiUnauthorizedResponse({ description: UnAuthorizedToken.message })
  @ApiNotFoundResponse({ description: UserNotFound.message })
  @ApiCreatedResponse({ description: LikeCreatedResponse.message })
  @ApiNoContentResponse({ description: LikeNoContentResponse.message })
  @ApiParam({
    name: 'postId',
    description: '좋아요 누른 게시물 고유 식별 ID',
    required: true,
    example: '62da0ab0f6500db35b449da3',
  })
  @ApiOperation({ description: '게시물 좋아요 API 입니다.', summary: '게시물 좋아요' })
  async likePost(@Res({ passthrough: true }) res: Response, @Req() req: Request, @Param('postId') postId) {
    const {
      user: {
        user: { email },
      },
    } = req;

    const isInserted = await this.likeService.likePost(email, postId);

    responseHandler(res, {
      statusCode: isInserted ? LikeCreatedResponse.code : LikeNoContentResponse.code,
      statusMessage: isInserted ? LikeCreatedResponse.message : LikeNoContentResponse.message,
    });
  }

  @Put('/unlike/:postId')
  @UseGuards(AccessJWTGuard)
  // swagger
  @ApiCookieAuth(CONSTANT_ACCESS)
  @ApiUnauthorizedResponse({ description: UnAuthorizedToken.message })
  @ApiNotFoundResponse({ description: UserNotFound.message })
  @ApiNoContentResponse({ description: UnlikeResponse.message })
  @ApiParam({
    name: 'postId',
    description: '좋아요 취소한 게시물 고유 식별 ID',
    required: true,
    example: '62da0ab0f6500db35b449da3',
  })
  @ApiOperation({ description: '게시물 좋아요 취소 API 입니다.', summary: '게시물 좋아요 취소' })
  async unlikePost(@Res({ passthrough: true }) res: Response, @Req() req: Request, @Param('postId') postId) {
    const {
      user: {
        user: { email },
      },
    } = req;

    await this.likeService.unlikePost(email, postId);

    responseHandler(res, {
      statusCode: UnlikeResponse.code,
      statusMessage: UnlikeResponse.message,
    });
  }
}
