import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { get } from 'http';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('User login')
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
    return {
      user,
    };
  }
  @Public()
  @ResponseMessage('get user by refresh token')
  @Get('/refresh')
  async handleRefreshToken(@Req() request: Request) {
    const refresh_token = request.cookies['refresh_token'];

    return this.authService.processNewToken(refresh_token);
  }
}
