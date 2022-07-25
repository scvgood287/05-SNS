import { Injectable } from '@nestjs/common';
import PostRepository from '../post/post.repository';
import LikeRepository from './like.repository';

@Injectable()
export default class LikeService {
  constructor(private readonly likeRepository: LikeRepository, private readonly postRepository: PostRepository) {}

  async likePost(email: string, postId: string): Promise<boolean> {
    const like = await this.likeRepository.updateLike(email, postId, true);

    console.log(like);

    if (!like?.isLiked) {
      await this.postRepository.updatePost({}, postId, {}, { $inc: { likes: 1 } });
    }

    return !like;
  }

  async unlikePost(email: string, postId: string) {
    const like = await this.likeRepository.updateLike(email, postId, false);

    console.log(like);

    if (like.isLiked) {
      await this.postRepository.updatePost({}, postId, {}, { $inc: { likes: -1 } });
    }

    console.log(like);
  }
}
