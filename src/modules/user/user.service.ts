import { Injectable } from '@nestjs/common';
import { CreateUserDTO, LoginDTO } from './dto';
import ProtectedUserResponse from './responses/protectedUser.response';
import UserRepository from './user.repository';

@Injectable()
export default class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(createUserDTO: CreateUserDTO): Promise<ProtectedUserResponse> {
    const user = await this.userRepository.createUser(createUserDTO);

    return user.protectedData;
  }

  async login(loginDTO: LoginDTO) {
    const { email, password } = loginDTO;
  }
}
