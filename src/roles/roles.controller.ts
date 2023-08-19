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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { userInfo } from 'os';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage('Create a new role')
  async create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return await this.rolesService.create(createRoleDto, user);
  }

  @Get()
  @ResponseMessage('Fetch all roles with paginate')
  async findAll(
    @Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return await this.rolesService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch a role by id')
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a role')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: IUser,
  ) {
    return await this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a role by id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.rolesService.remove(id, user);
  }
}
