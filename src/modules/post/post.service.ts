import { Injectable } from '@nestjs/common';
import { CreatePostDTO, UpdatePostDTO } from './dto';
import GetPostsDTO from './dto/getPosts.dto';
import PostRepository from './post.repository';
import { Post } from './post.schema';

@Injectable()
export default class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(email: string, createPostDTO: CreatePostDTO): Promise<Post> {
    const post = await this.postRepository.createPost(createPostDTO, email);

    return post;
  }

  async updatePost(postId, updatePostDTO: UpdatePostDTO): Promise<Post> {
    const post = await this.postRepository.updatePost(postId, updatePostDTO);

    return post;
  }

  async deletePost(postId) {
    await this.postRepository.deletePost(postId);
  }

  async restorePost(postId) {
    await this.postRepository.restorePost(postId);
  }

  async getPost(postId): Promise<Post> {
    const post = await this.postRepository.getPost(postId);

    return post;
  }

  async getPosts(getPostsDTO: GetPostsDTO): Promise<Post[]> {
    const posts = await this.postRepository.getPosts(getPostsDTO);

    return posts;
  }
}
