import { Injectable } from '@nestjs/common';
import { CreateUserDTO, LoginDTO, UpdateUserDTO } from './dto';
import ProtectedUser from './entities/protectedUser.entity';
import UserRepository from './user.repository';

@Injectable()
export default class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(createUserDTO: CreateUserDTO): Promise<ProtectedUser> {
    const user = await this.userRepository.createUser(createUserDTO);

    return user.protectedData;
  }

  async setRefreshToken({ email, hashedRefreshToken }: UpdateUserDTO) {
    await this.userRepository.updateUser({ email, hashedRefreshToken });
  }
}
