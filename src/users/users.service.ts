import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService} from '@nestjs/jwt'
import { CreateUserDto} from './dto/create-user.dto';
import { MailService } from '../auth/mail.service';
import Mail from 'nodemailer/lib/mailer';


@Injectable()
export class UsersService {
    constructor (private readonly prisma: PrismaService, private readonly jwtService: JwtService, private readonly mailService: MailService ) {}

    async create(createUserDto: CreateUserDto) {

    try {
        const URL = process.env.APP_URL

        if(!URL) {
            return {
                message: "URL Inválida"
            }
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
        const user = await this.prisma.user.create({
            data: {
                username: createUserDto.username,
                name: createUserDto.name,
                email: createUserDto.email,
                password: hashedPassword,
            },
        })



        const verificationToken = this.jwtService.sign(
                { email: user.email }, 
                {secret: process.env.JWT_SECRET, expiresIn: '1d' }
            );


        const verificationLink = `${URL}/auth/verify-email?token=${verificationToken}`;

        await this.mailService.sendVerificationEmail(user.email, verificationLink);

        return user
    }
        catch(error: any) {

        if(error.code === "P2002") {
                throw new ConflictException("Esse e=mail já está cadastrado")
        }

            throw error
        }

    }


    
}



    
