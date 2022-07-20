import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiProperty({ description: '응답 코드' })
  statusCode: number;

  @ApiProperty({ description: '응답 메시지' })
  message: string;
}
