import {
  Controller,
  UseGuards,
  Post,
  Res,
  Req,
  Patch,
  Get,
  Param,
  Query,
  Delete,
  Body,
  ParseArrayPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { AccessJWTGuard, UserAuthorizeGuard } from '../auth/guards';
import PostService from './post.service';
import { CreatePostDTO, UpdatePostDTO, GetPostsDTO } from './dto';
import { responseHandler } from 'src/utils/response';
import { OrderBysType } from 'src/utils/customTypes';

@ApiTags('posts')
@Controller('posts')
@UseGuards(AccessJWTGuard)
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('')
  async createPost(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Body() createPostDTO: CreatePostDTO,
  ) {
    const {
      user: {
        user: { email },
      },
    } = req;
    const post = await this.postService.createPost(email, createPostDTO);

    responseHandler(res, {
      json: post,
      statusCode: 201,
    });
  }

  @Patch('/:postId')
  @UseGuards(UserAuthorizeGuard)
  async updatePost(@Res({ passthrough: true }) res: Response, @Param() postId, @Body() updatePostDTO: UpdatePostDTO) {
    const post = await this.postService.updatePost(postId, updatePostDTO);

    responseHandler(res, {
      json: post,
      statusCode: 200,
    });
  }

  @Delete('/:postId')
  @UseGuards(UserAuthorizeGuard)
  async deletePost(@Res({ passthrough: true }) res: Response, @Param() postId) {
    await this.postService.deletePost(postId);

    responseHandler(res, {
      statusCode: 204,
    });
  }

  @Patch('/restore/:postId')
  @UseGuards(UserAuthorizeGuard)
  async restorePost(@Res({ passthrough: true }) res: Response, @Param() postId) {
    await this.postService.restorePost(postId);

    responseHandler(res, {
      statusCode: 200,
    });
  }

  @Get('/:postId')
  async getPost(@Res({ passthrough: true }) res: Response, @Param() postId) {
    const post = await this.postService.getPost(postId);

    responseHandler(res, {
      json: post,
      statusCode: 200,
    });
  }

  @Get('')
  async getPosts(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Query(
      'orderBy',
      new DefaultValuePipe(['createdAt']),
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    orderBy: OrderBysType,
    @Query('search', new DefaultValuePipe(null)) search: string | null,
    @Query(
      'hashtags',
      new DefaultValuePipe(null),
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    hashtags: string[] | null,
    @Query('offset', new DefaultValuePipe(1)) page: number,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
  ) {
    const getPostsDTO: GetPostsDTO = { orderBy, search, hashtags, page, limit };
    const posts = await this.postService.getPosts(getPostsDTO);

    responseHandler(res, {
      json: posts,
      statusCode: 200,
    });
  }
}
