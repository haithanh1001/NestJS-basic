import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from './../users/dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { genSaltSync, hashSync } from 'bcryptjs';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  //username va pass la 2 tham so thu vien passport no nem ve
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassword(
        password,
        user.password,
      );
      if (isValid) {
        return user;
      }
    }
    return null;
  }

  async login(user: IUser) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };
    const refresh_token = this.createRefreshToken(payload);
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token,
      user: {
        _id,
        name,
        email,
        role,
      },
    };
  }
  async registerUserService(registerUserDto: RegisterUserDto) {
    let user = await this.usersService.registerUserService(registerUserDto);
    if (user) {
      return {
        _id: user._id,
        createdAt: user.createdAt,
      };
    }
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refresh_token;
  };
}
