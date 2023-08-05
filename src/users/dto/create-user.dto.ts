//DTO
import { IsEmail, IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsEmail({}, { message: 'Email phai dung dinh dang' })
  @IsNotEmpty({ message: 'Email khong duoc de trong' })
  public email: string; //default: public
  @IsNotEmpty({ message: 'Password khong duoc de trong' })
  password: string;
  name: string;
  address: string;
}
