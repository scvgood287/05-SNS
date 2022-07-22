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
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiOperation, ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AccessJWTGuard } from '../auth/guards';
import PostService from './post.service';
import { CreatePostDTO, UpdatePostDTO, GetPostsDTO } from './dto';
import { responseHandler } from 'src/utils/response';
import { OrderBysType, SortBysType } from 'src/utils/customTypes';

@ApiTags('posts')
@Controller('posts')
@UseGuards(AccessJWTGuard)
export default class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('')
  @ApiBody({ type: CreatePostDTO })
  @ApiOperation({ description: '게시물 생성 API 입니다.', summary: '게시물 생성' })
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
    const post = await this.postService.createPost(createPostDTO, email);

    responseHandler(res, {
      json: post,
      statusCode: 201,
    });
  }

  @Patch('/:postId')
  // @UseGuards(RolesGuard)
  @ApiBody({ type: UpdatePostDTO })
  @ApiParam({
    name: 'postId',
    description: '수정할 게시물 고유 식별 ID',
    required: true,
    example: '62da0ab0f6500db35b449da3',
  })
  @ApiOperation({ description: '게시물 수정 API 입니다.', summary: '게시물 수정' })
  async updatePost(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Param('postId') postId,
    @Body() updatePostDTO: UpdatePostDTO,
  ) {
    const {
      user: {
        user: { email },
      },
    } = req;
    const isUpdated = await this.postService.updatePost(updatePostDTO, postId, email);

    // response 수정 필요
    responseHandler(res, {
      json: isUpdated ? '게시물이 성공적으로 수정되었습니다' : '게시물 수정에 실패했습니다. 다시 시도해주세요.',
      statusCode: 200,
    });
  }

  @Delete('/:postId')
  // @UseGuards(RolesGuard)
  @ApiParam({
    name: 'postId',
    description: '삭제할 게시물 고유 식별 ID',
    required: true,
    example: '62da0ab0f6500db35b449da3',
  })
  @ApiOperation({ description: '게시물 삭제 API 입니다. 복구 가능합니다.', summary: '게시물 삭제' })
  async deletePost(@Res({ passthrough: true }) res: Response, @Req() req: Request, @Param('postId') postId) {
    const {
      user: {
        user: { email },
      },
    } = req;
    const isDeleted = await this.postService.deletePost(postId, email);

    // response 수정 필요
    responseHandler(res, {
      // json: isDeleted ? '게시물이 성공적으로 삭제되었습니다.' : '게시물 삭제에 실패했습니다. 다시 시도해주세요.',
      statusCode: 204,
    });
  }

  @Patch('/restore/:postId')
  // @UseGuards(RolesGuard)
  @ApiParam({
    name: 'postId',
    description: '복구할 게시물 고유 식별 ID',
    required: true,
    example: '62da0ab0f6500db35b449da3',
  })
  @ApiOperation({ description: '게시물 복구 API 입니다.', summary: '게시물 복구' })
  async restorePost(@Res({ passthrough: true }) res: Response, @Req() req: Request, @Param('postId') postId) {
    const {
      user: {
        user: { email },
      },
    } = req;
    const isRestored = await this.postService.restorePost(postId, email);

    // response 수정 필요
    responseHandler(res, {
      // json: isRestored ? '게시물이 성공적으로 복구되었습니다.' : '게시물 복구에 실패했습니다. 다시 시도해주세요.',
      statusCode: 200,
    });
  }

  @Get('/:postId')
  @ApiParam({
    name: 'postId',
    description: '상세 조회할 게시물 고유 식별 ID',
    required: true,
    example: '62da0ab0f6500db35b449da3',
  })
  @ApiOperation({ description: '게시물 상세 조회 API 입니다.', summary: '게시물 상세 조회' })
  async getPost(@Res({ passthrough: true }) res: Response, @Param('postId') postId) {
    const post = await this.postService.getPost(postId);

    responseHandler(res, {
      json: post,
      statusCode: 200,
    });
  }

  @Get('')
  @ApiQuery({
    name: 'sortBy',
    description: '게시물 정렬 조건',
    example: 'createdAt',
    required: false,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: 'orderBy',
    description: '게시물 정렬 방식(오름차순/내림차순)',
    example: 'asc',
    required: false,
    isArray: false,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: 'search',
    description: '제목 혹은 본문 검색시 사용될 키워드',
    example: '제목',
    required: false,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: 'hashtags',
    description: '게시물 검색 기준이 될 해시태그들',
    example: '서울,맛집',
    required: false,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: 'page',
    description: '검색한 게시물 보여줄 페이지',
    example: '1',
    required: false,
    allowEmptyValue: true,
  })
  @ApiQuery({
    name: 'limit',
    description: '검색한 게시물 보여줄 최대 갯수',
    example: '10',
    required: false,
    allowEmptyValue: true,
  })
  @ApiOperation({ description: '게시물 목록 조회 API 입니다.', summary: '게시물 목록 조회' })
  async getPosts(
    @Res({ passthrough: true }) res: Response,
    @Query(
      'sortBy',
      new DefaultValuePipe(['createdAt']),
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    sortBy: SortBysType,
    @Query(
      'orderBy',
      new DefaultValuePipe(['asc']),
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    orderBy: OrderBysType,
    @Query('search', new DefaultValuePipe('')) search: string,
    @Query(
      'hashtags',
      new DefaultValuePipe(['']),
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    hashtags: string[],
    @Query('page', new DefaultValuePipe(1), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    page: number,
    @Query('limit', new DefaultValuePipe(10), new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
    limit: number,
  ) {
    const getPostsDTO: GetPostsDTO = { sortBy, orderBy, search, hashtags, page, limit };
    const posts = await this.postService.getPosts(getPostsDTO);

    responseHandler(res, {
      json: posts,
      statusCode: 200,
    });
  }
}
