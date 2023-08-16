import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';
import { CreateJobDto } from './create-job.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @IsNotEmpty({ message: 'Id cua job khong duoc de trong' })
  _id: mongoose.Schema.Types.ObjectId;
}
