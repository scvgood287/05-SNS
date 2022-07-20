import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateUserDTO } from './dto';
import { User, UserDocument } from './user.schema';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

@Injectable()
export default class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: SoftDeleteModel<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    const hashedPassword: string = await bcrypt.hash(
      createUserDTO.password,
      this.configService.get<number>('SALT_ROUNDS'),
    );
    const user = await this.userModel.create({
      ...createUserDTO,
      hashedPassword,
    });

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });

    return user;
  }
}
