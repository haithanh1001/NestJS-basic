import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Name khong duoc bo trong' })
  name: string;
  @IsNotEmpty({ message: 'Description khong duoc bo trong' })
  description: string;
  @IsNotEmpty({ message: 'IsActive khong duoc bo trong' })
  @IsBoolean({ message: 'IsActive phai co gia tri boolean' })
  isActive: boolean;
  @IsNotEmpty({ message: 'Permissions khong duoc bo trong' })
  @IsArray({ message: 'Permission phai co dinh dang la array' })
  @IsMongoId({
    each: true,
    message: 'Phan tu cua permission phai co gia tri ObjectId',
  })
  permissions: mongoose.Schema.Types.ObjectId[];
}
