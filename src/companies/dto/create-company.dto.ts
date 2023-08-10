//DTO
import { IsNotEmpty } from 'class-validator';
export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Ten cong ty khong duoc de trong' })
  name: string;
  @IsNotEmpty({ message: 'Dia chi cong ty khong duoc de trong' })
  address: string;
  @IsNotEmpty({ message: 'Mo ta cong ty khong duoc de trong' })
  description: string;
}
