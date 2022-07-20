import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/utils/response';
import ProtectedUserResponse from './protectedUser.response';

export default class SignUpResponse extends BaseResponse {
  @ApiProperty({ description: '회원가입 된 유저 정보' })
  user: ProtectedUserResponse;
}
