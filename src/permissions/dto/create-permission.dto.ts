import { IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'Name khong duoc bo trong' })
  name: string;
  @IsNotEmpty({ message: 'API path khong duoc bo trong' })
  apiPath: string;
  @IsNotEmpty({ message: 'Method khong duoc bo trong' })
  method: string;
  @IsNotEmpty({ message: 'Module khong duoc bo trong' })
  module: string;
}
