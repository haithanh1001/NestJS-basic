import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}
  @ResponseMessage('Create a new job')
  @Post()
  async create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    const job = await this.jobsService.create(createJobDto, user);
    if (job) {
      return {
        _id: job._id,
        createdAt: job.createdAt,
      };
    }
  }
  @ResponseMessage('Fetch all jobs with paginate')
  @Get()
  findAll(
    @Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.jobsService.findAll(+page, +limit, qs);
  }
  @ResponseMessage('Fetch a job by id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'not found job';
    }
    return this.jobsService.findOne(id);
  }
  @ResponseMessage('Update a job')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @User() user: IUser,
  ) {
    return await this.jobsService.update(id, updateJobDto, user);
  }
  @ResponseMessage('Delete a job')
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.jobsService.remove(id, user);
  }
}
