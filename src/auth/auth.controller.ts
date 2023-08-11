import { Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { Public, User } from 'src/decorator/customize';
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
    console.log('>>info: ', user);
    return this.authService.login(user);
  }

  // @UseGuards(JwtAuthGuard)
  // @Public()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
