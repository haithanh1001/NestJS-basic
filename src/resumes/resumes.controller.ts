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
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}
  @ResponseMessage('Create a new resume')
  @Post()
  async create(@Body() createUserCvDto: CreateUserCvDto, @User() user: IUser) {
    let result = await this.resumesService.create(createUserCvDto, user);
    return result;
  }
  @ResponseMessage('Fetch all resumes with paginate')
  @Get()
  async findAll(
    @Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return await this.resumesService.findAll(+page, +limit, qs);
  }
  @ResponseMessage('Fetch a resume by id')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.resumesService.findOne(id);
  }
  @ResponseMessage('Update status resume')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('status') status: string,
    @User() user: IUser,
  ) {
    return await this.resumesService.update(id, status, user);
  }
  @ResponseMessage('Delete a resume by id')
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.resumesService.remove(id, user);
  }
  @ResponseMessage('Get Resumes By User')
  @Post('/by-user')
  async handleGetAllResumesByUser(@User() user: IUser) {
    return await this.resumesService.getAllResumesByUser(user);
  }
}
