import mongoose from 'mongoose';

//DTO
import { Prop, Schema } from '@nestjs/mongoose';
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class Company {
  @IsNotEmpty()
  _id: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty()
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
  @Prop()
  role: string;

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
