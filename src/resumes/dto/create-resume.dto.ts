import { Schema } from '@nestjs/mongoose';
import { IsEmail, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateResumeDto {
  @IsEmail({}, { message: 'Email phai dung dinh dang' })
  @IsNotEmpty({ message: 'Email khong duoc de trong' })
  email: string; //default: public
  @IsNotEmpty({ message: 'UserId khong duoc de trong' })
  userId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty({ message: 'Url khong duoc de trong' })
  url: string;
  @IsNotEmpty({ message: 'Status khong duoc de trong' })
  status: string;
  @IsNotEmpty({ message: 'CompanyId khong duoc de trong' })
  companyId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty({ message: 'JobId khong duoc de trong' })
  jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto {
  @IsNotEmpty({ message: 'Url khong duoc de trong' })
  url: string;
  @IsNotEmpty({ message: 'CompanyId khong duoc de trong' })
  @IsMongoId({ message: `CompanyId isn't a mongo id` })
  companyId: mongoose.Schema.Types.ObjectId;
  @IsNotEmpty({ message: 'JobId khong duoc de trong' })
  @IsMongoId({ message: `JobId isn't a mongo id` })
  jobId: mongoose.Schema.Types.ObjectId;
}
