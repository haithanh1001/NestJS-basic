import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req, @User() user) {
    return this.authService.login(user);
  }

  @Public()
  @ResponseMessage('Register a new User')
  @Post('register')
  async registerUserController(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.registerUserService(registerUserDto);
  }
}
