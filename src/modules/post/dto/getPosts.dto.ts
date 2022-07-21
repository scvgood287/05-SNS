import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString } from 'class-validator';
import { OrderBys } from 'src/constants';
import { OrderBysType } from 'src/utils/customTypes';

export default class GetPostsDTO {
  @ApiProperty({ description: '게시물 정렬 조건들', example: 'createdAt,likes' })
  @IsIn(OrderBys, { each: true })
  @IsString({ each: true })
  readonly orderBy: Partial<OrderBysType>;

  @ApiProperty({ description: '제목 혹은 본문 검색 시 사용될 키워드', example: '후기' })
  readonly search: string | null;

  @ApiProperty({ description: '게시물 검색 기준이 될 해시태그들', example: '서울,맛집' })
  @IsString({ each: true })
  readonly hashtags: string[] | null;

  @ApiProperty({ description: '검색한 게시물 보여줄 페이지', example: '1' })
  @IsNumber()
  readonly page: number;

  @ApiProperty({ description: '검색한 게시물 보여줄 최대 갯수', example: '10' })
  @IsNumber()
  readonly limit: number;
}
