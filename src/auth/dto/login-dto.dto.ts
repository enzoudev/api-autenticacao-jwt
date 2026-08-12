import { IsEmail, IsNotEmpty, MinLength, IsString, isEmail } from 'class-validator';
export class LoginUserDto {
  
  @IsNotEmpty()
  @IsString()
  credentials!: string;


  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password!: string;
}




export class ForgotPasswordDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string;
}