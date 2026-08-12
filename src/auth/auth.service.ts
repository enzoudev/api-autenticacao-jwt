import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService} from '@nestjs/jwt'
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto } from './dto/login-dto.dto';
import { MailService } from './mail.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService, private mailService: MailService ) {}



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



    async validateGoogleUser(googleUser: { email: string; name: string; picture: string }) {

        try {
            let user = await this.prisma.user.findUnique({
                where: {email: googleUser.email}
            })


            if(!user) {
                user = await this.prisma.user.create({
                    data: {
                        email: googleUser.email,
                        name: googleUser.name,
                        username: googleUser.email.split('@')[0],
                        password: '',
                    },
                })
            }

            const token = this.jwtService.sign(
                {id: user.id, name: user.name, username: user.username, email: user.email, role: user.role},
                {secret: process.env.JWT_SECRET, expiresIn: "24h"}
            )


            return {
                message: "Login com o google feito com sucesso!",
                token
            }
        } catch(err: any) {
            if(err instanceof UnauthorizedException) {
                throw err
            }

            throw err
        }

    }



    async forgotPassword(email: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {email}
            })
            if(user) {
                const resetToken = this.jwtService.sign(
                { email: user.email }, 
                { secret: process.env.JWT_SECRET, expiresIn: '15m' }
                );

                await this.mailService.sendForgotPasswordEmail(user.email, resetToken);
            }
            console.log("E-mail enviado com sucesso!");


            return { message: "Se o e-mail estiver cadastrado em nossa base, você receberá instruções para redefinir sua senha em instantes." };
        } catch(err) {
            throw err
        }
    }


    async resetPassword(token: string, newPassword: string) {
        try {
    
            const payload = this.jwtService.verify(token, {
            secret: process.env.JWT_SECRET,
            });


            const hashedPassword = await bcrypt.hash(newPassword, 10);


            await this.prisma.user.update({
            where: { email: payload.email },
            data: { password: hashedPassword },
            });

            return { message: "Senha redefinida com sucesso!" };
        } catch (error) {
            throw new Error("Token inválido ou expirado.");
  }
}

}