import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../post/post.schema';
import ProtectedUser from './entities/protectedUser.entity';

@Schema({ timestamps: true, id: false, _id: false })
export class User {
  @ApiProperty({ description: '유저 이메일이자 고유 id', example: 'test@mail.com' })
  @Prop({ required: true, unique: true })
  readonly email: string;

  @ApiProperty({ description: '유저 닉네임', example: '한글nickname123' })
  @Prop({ required: true })
  readonly nickname: string;

  @ApiProperty({ description: '유저 비밀번호', example: 'password123' })
  @Prop({ required: true })
  readonly hashedPassword: string;

  @ApiProperty({ description: '유저 리프레시 토큰' })
  @Prop({ default: '' })
  readonly hashedRefreshToken: string;

  @Prop({ type: [Types.ObjectId], ref: Post.name })
  readonly posts: Post[];

  readonly protectedData: ProtectedUser;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User).plugin(softDeletePlugin);

UserSchema.virtual('protectedData').get(function (this: User) {
  return {
    email: this.email,
    nickname: this.nickname,
  };
});
