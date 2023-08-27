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
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import {
  ResponseMessage,
  SkipCheckPermission,
  User,
} from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('subscribers')
@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  @ResponseMessage('Create a subcriber')
  async create(
    @Body() createSubscriberDto: CreateSubscriberDto,
    @User() user: IUser,
  ) {
    return await this.subscribersService.create(createSubscriberDto, user);
  }

  @Get()
  @ResponseMessage('Fetch all subscribers with paginate')
  async findAll(
    @Query('current') page: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return await this.subscribersService.findAll(+page, +limit, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch a subscriber by id')
  async findOne(@Param('id') id: string) {
    return await this.subscribersService.findOne(id);
  }

  @Post('skills')
  @ResponseMessage("Get subscriber's skill")
  @SkipCheckPermission()
  getUserSkills(@User() user: IUser) {
    return this.subscribersService.getSkills(user);
  }

  @Patch()
  @SkipCheckPermission()
  @ResponseMessage('Update a subscriber')
  async update(
    @Body() updateSubscriberDto: UpdateSubscriberDto,
    @User() user: IUser,
  ) {
    return await this.subscribersService.update(updateSubscriberDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a subscriber by id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.subscribersService.remove(id, user);
  }
}
