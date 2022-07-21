import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SortOptions } from 'src/utils/customTypes';
import { CreatePostDTO, GetPostsDTO, UpdatePostDTO } from './dto';
import { Post, PostDocument } from './post.schema';

@Injectable()
export default class PostRepository {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: SoftDeleteModel<PostDocument>,
  ) {}

  async createPost(createPostDTO: CreatePostDTO, email: string): Promise<Post> {
    const post = await this.postModel.create({
      ...createPostDTO,
      email,
    });

    return post;
  }

  async updatePost(postId, updatePostDTO: UpdatePostDTO): Promise<Post> {
    const post = await this.postModel.findByIdAndUpdate(postId, updatePostDTO, { new: true });

    return post;
  }

  async deletePost(postId) {
    await this.postModel.softDelete({ _id: postId });
  }

  async restorePost(postId) {
    await this.postModel.restore(postId);
  }

  async getPost(postId): Promise<Post> {
    const post = await this.postModel.findById(postId);

    return post;
  }

  async getPosts(getPostsDTO: GetPostsDTO): Promise<Post[]> {
    const { orderBy, search, hashtags, page, limit } = getPostsDTO;
    // 추후 복수 정렬 조건 구현
    const sortOptions: SortOptions = {
      [orderBy[0]]: 1,
    };
    const filter: FilterQuery<Post> = {};

    if (!!search) {
      const searchQuery = new RegExp(search, 'ui');
      filter.$or = [{ title: searchQuery }, { contents: searchQuery }];
    }

    if (!!hashtags) {
      filter.hashtags = { $all: hashtags };
    }

    // 이렇게 구현했을때 부작용
    // 예를 들어 데이터를 page 가 5, limit 이 1000 일 경우,
    // 데이터를 5000개 불러와서 앞의 4000개를 건너 뛰어야 한다.
    // 점점 page 가 커지면 커질수록, 불러와야 할 데이터가 늘어나기 때문에 가면 갈수록 훨씬 느려진다.
    // 그러므로 DP?(내가 생각하기엔 DP스럽다 생각함) 를 적용한 버킷 패턴을 구현해볼 예정이다.
    // 일단 지금은 구현부터...
    // 추후 버킷 패턴 구현
    // https://www.mongodb.com/blog/post/paging-with-the-bucket-pattern--part-1
    const posts = await this.postModel
      .find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    return posts;
  }
}
