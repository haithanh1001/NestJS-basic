import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { get } from 'http';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { RolesService } from 'src/roles/roles.service';
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private rolesService: RolesService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @UseGuards(ThrottlerGuard)
  // @Throttle(5, 60)
  @ResponseMessage('User login')
  @ApiBody({ type: UserLoginDto })
  @Post('/login')
  handleLogin(
    @Req() req: Request,
    @User() user,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }

  @Public()
  @ResponseMessage('Register a new User')
  @Post('register')
  async registerUserController(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.registerUserService(registerUserDto);
  }

  @ResponseMessage('get user information')
  @Get('/account')
  async handleGetAccount(@User() user: IUser) {
    const temp = (await this.rolesService.findOne(user.role._id)) as any;
    user.permissions = temp.permissions;
    return {
      user,
    };
  }
  @Public()
  @ResponseMessage('get user by refresh token')
  @Get('/refresh')
  async handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refresh_token = request.cookies['refresh_token'];

    return this.authService.processNewToken(refresh_token, response);
  }

  @ResponseMessage('logout user')
  @Post('/logout')
  async handleLogout(
    @User() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logout(user, response);
  }
}
