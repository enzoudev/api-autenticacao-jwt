import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()

  name!: string;
  username!: string

  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;

}

