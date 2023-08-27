import { Reflector } from '@nestjs/core';
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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ResponseMessage('Create a new User')
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    let result = await this.usersService.create(createUserDto, user);
    if (result) {
      return {
        _id: result.id,
        createdAt: result.createdAt,
      };
    }
  }
  @ResponseMessage('Fetch all users with paginate')
  @Get()
  async findAll(
    @Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+page, +limit, qs);
  }
  @Public()
  @ResponseMessage('Fetch user by id')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    let user = await this.usersService.findOne(id);
    return user;
  }
  @ResponseMessage('Update a User')
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    let result = await this.usersService.update(updateUserDto, user);
    return result;
  }
  @ResponseMessage('Delete a user')
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    let result = await this.usersService.remove(id, user);
    return result;
  }
}
