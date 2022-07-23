import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import CreatePostDTO from './createPost.dto';

export default class UpdateUserDTO {
  @ApiProperty({ description: '게시물 제목', example: '게시물 1의 제목 수정' })
  @IsString()
  readonly title?: string;

  @ApiProperty({ description: '게시물 본문', example: '게시물 1의 본문 수정' })
  @IsString()
  readonly contents?: string;

  @ApiProperty({ description: '해시태그, #으로 시작하고 ,로 구분', example: '#맛집,#서울,#브런치 카페,#주말,#수정' })
  @IsString()
  hashtags?: string | string[];

  @IsNumber()
  views?: number;
}
