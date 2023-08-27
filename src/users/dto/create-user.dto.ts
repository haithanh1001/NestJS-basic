import mongoose from 'mongoose';

//DTO
import { Prop, Schema } from '@nestjs/mongoose';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class Company {
  @IsNotEmpty({ message: 'Id cua cong ty khong duoc de trong' })
  _id: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty({ message: 'Ten cong ty khong duoc de trong' })
  name: string;
}
export class CreateUserDto {
  @IsNotEmpty({ message: 'Name khong duoc de trong' })
  name: string;
  @IsEmail({}, { message: 'Email phai dung dinh dang' })
  @IsNotEmpty({ message: 'Email khong duoc de trong' })
  public email: string; //default: public
  @IsNotEmpty({ message: 'Password khong duoc de trong' })
  password: string;
  @IsNotEmpty({ message: 'Age khong duoc de trong' })
  age: number;
  @IsNotEmpty({ message: 'Gender khong duoc de trong' })
  gender: string;
  @IsNotEmpty({ message: 'Address khong duoc de trong' })
  address: string;
  @IsNotEmpty({ message: 'Role khong duoc de trong' })
  @IsMongoId({ message: 'Role co dinh dang la ObjectId' })
  role: mongoose.Schema.Types.ObjectId;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Name khong duoc de trong' })
  name: string;
  @IsEmail({}, { message: 'Email phai dung dinh dang' })
  @IsNotEmpty({ message: 'Email khong duoc de trong' })
  public email: string; //default: public
  @IsNotEmpty({ message: 'Password khong duoc de trong' })
  password: string;

  @IsNotEmpty({ message: 'Age khong duoc de trong' })
  age: number;
  @IsNotEmpty({ message: 'Gender khong duoc de trong' })
  gender: string;
  @IsNotEmpty({ message: 'Address khong duoc de trong' })
  address: string;
}

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@gmail.com' })
  readonly username: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'password',
  })
  readonly password: string;
}
