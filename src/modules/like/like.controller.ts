import { Controller, Param, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AccessJWTGuard } from '../auth/guards';
import { Response, Request } from 'express';
import { responseHandler } from 'src/utils/response';
import LikeService from './like.service';

@ApiTags('likes')
@Controller('likes')
export default class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Put('/like/:postId')
  @UseGuards(AccessJWTGuard)
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
      statusCode: isInserted ? 201 : 204,
    });
  }

  @Put('/unlike/:postId')
  @UseGuards(AccessJWTGuard)
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
      statusCode: 204,
    });
  }
}
