import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    console.log('>>check req body: ', createUserDto);
    let result = await this.usersService.create(createUserDto);
    return {
      EC: 0,
      data: result,
    };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let user = await this.usersService.findOne(id);
    return {
      EC: 0,
      data: user,
    };
  }

  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto) {
    let result = await this.usersService.update(updateUserDto);
    return {
      EC: 0,
      data: result,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let result = await this.usersService.remove(id);
    return {
      EC: 0,
      data: result,
    };
  }
}
