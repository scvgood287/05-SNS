import { ApiProperty } from '@nestjs/swagger';
import { Response } from 'express';

export class BaseResponse {
  @ApiProperty({ description: '응답 코드' })
  statusCode: number;

  @ApiProperty({ description: '응답 메시지' })
  message: string;
}

export type ResponseHandlerOptions = Partial<Record<keyof Response, any>>;

export const responseHandler = (res: Response, options: ResponseHandlerOptions) =>
  Object.entries(options).forEach(([key, value]) =>
    Array.isArray(value)
      ? Array.isArray(value[0])
        ? value.forEach(v => res[key](...v))
        : res[key](...value)
      : res[key](value),
  );
