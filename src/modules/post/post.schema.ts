import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ timestamps: true, _id: false })
export class Post {
  @ApiProperty({ description: '게시물 식별 id' })
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @ApiProperty({ description: '게시물 제목', example: '게시물 1의 제목' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: '게시물 내용', example: '게시물 1의 내용' })
  @Prop({ required: true })
  contents: string;

  @ApiProperty({ description: '게시물 해시태그', example: ['맛집', '서울', '브런치 카페', '주말'] })
  @Prop({ required: true })
  hashtags: string[];

  @ApiProperty({ description: '게시물 조회 수', example: 91345 })
  @Prop({ default: 0 })
  views: number;

  @ApiProperty({
    description: '게시물 좋아요를 누른 유저 email 배열',
    example: ['test1@mail.com', 'test2@mail.com', 'test3@mail.com'],
  })
  @Prop({ default: [] })
  likes: string[];
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post).plugin(softDeletePlugin);
