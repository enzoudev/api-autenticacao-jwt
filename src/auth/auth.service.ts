import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService} from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService  ) {}



  async login(loginUserDto: LoginUserDto) {
          try {
              const user = await this.prisma.user.findFirst({
              where: {
                  OR: [
                      {email: loginUserDto.credentials},
                      {username: loginUserDto.credentials},
                  ],
                  
                  }
              })
  
  
              if(!user) {
                  throw new UnauthorizedException("Usuário/email não cadastrados");
              }
  
              const passwordValid = await bcrypt.compare(loginUserDto.password, user.password);
  
              if(!passwordValid) {
                  throw new UnauthorizedException("Senha inválida");
              }
  
              const token = this.jwtService.sign(
                  {id: user.id, name: user.name, username: user.username, email: user.email, role: user.role},
                  {secret: process.env.JWT_SECRET!, expiresIn: '24h'}
  
              )
  
              return {
                  message: 'Login realizado com sucesso!',
                  token
              }
  
          } catch( error: any) {
              if( error instanceof UnauthorizedException) {
                  throw error;
              }
  
              throw error
          }
      }
}