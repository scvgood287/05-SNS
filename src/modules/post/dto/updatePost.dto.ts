import { PartialType } from '@nestjs/mapped-types';
import CreatePostDTO from './createPost.dto';

export default class UpdateUserDTO extends PartialType(CreatePostDTO) {
  likes?: number;
  unlikes?: number;
  views?: number;
  comments?: number;
}
