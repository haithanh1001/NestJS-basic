import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty({ message: 'Name khong duoc de trong!' })
  name: string;

  @IsNotEmpty({ message: 'Email khong duoc de trong!' })
  @IsEmail({}, { message: 'Email khong hop le, vui long thu email khac!' })
  email: string;

  @IsNotEmpty({ message: 'Skills khong duoc de trong!' })
  @IsArray({ message: 'Skills phai co dinh dang la array!' })
  @IsString({ each: true, message: 'Moi skill phai co dinh dang string!' })
  skills: string[];
}
