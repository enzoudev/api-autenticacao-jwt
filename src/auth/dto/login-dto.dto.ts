import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
export class LoginUserDto {
  
  @IsNotEmpty()
  @IsString()
  credentials!: string;


  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password!: string;
}