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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}
  @ResponseMessage('Create a new permission')
  @Post()
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
    @User() user: IUser,
  ) {
    return await this.permissionsService.create(createPermissionDto, user);
  }
  @ResponseMessage('Fetch permissions with paginate')
  @Get()
  async findAll(
    @Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return await this.permissionsService.findAll(+page, +limit, qs);
  }
  @ResponseMessage('Fetch a permission by id')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.permissionsService.findOne(id);
  }
  @ResponseMessage('Update a permission')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @User() user: IUser,
  ) {
    return await this.permissionsService.update(id, updatePermissionDto, user);
  }
  @ResponseMessage('Delete a permission')
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.permissionsService.remove(id, user);
  }
}
