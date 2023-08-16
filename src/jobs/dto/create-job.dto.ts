import mongoose from 'mongoose';

//DTO
import { Prop, Schema } from '@nestjs/mongoose';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class Company {
  @IsNotEmpty({ message: 'Id cua cong ty khong duoc de trong' })
  _id: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty({ message: 'Ten cong ty khong duoc de trong' })
  name: string;
}
export class CreateJobDto {
  @IsNotEmpty({ message: 'Name khong duoc de trong' })
  name: string;
  @ArrayNotEmpty({ message: 'Skills khong duoc de trong' })
  @MinLength(3, { each: true, message: 'Skill khong hop le' })
  skills: string[];

  // @IsNotEmpty({ message: 'Location khong duoc de trong' })
  @Prop()
  location: string;
  @IsNotEmpty({ message: 'Salary khong duoc de trong' })
  salary: number;
  @IsNotEmpty({ message: 'Quantity khong duoc de trong' })
  quantity: number;
  @IsNotEmpty({ message: 'Level khong duoc de trong' })
  level: string;
  @IsNotEmpty({ message: 'Description khong duoc de trong' })
  description: string;
  @IsNotEmpty({ message: 'Start date khong duoc de trong' })
  startDate: string;
  @IsNotEmpty({ message: 'End date khong duoc de trong' })
  endDate: string;
  @IsNotEmpty({ message: 'Is active khong duoc de trong' })
  isActive: string;
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;
}
