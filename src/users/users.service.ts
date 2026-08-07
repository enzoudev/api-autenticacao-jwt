import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService} from '@nestjs/jwt'
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
    constructor (private readonly prisma: PrismaService, private readonly jwtService: JwtService ) {}

    async create(createUserDto: CreateUserDto) {

    try {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10)
        return await this.prisma.user.create({
            data: {
                username: createUserDto.username,
                name: createUserDto.name,
                email: createUserDto.email,
                password: hashedPassword,
            },
        })
    }
        catch(error: any) {

        if(error.code === "P2002") {
                throw new ConflictException("Esse e=mail já está cadastrado")
        }

            throw error
        }

    }


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
                {id: user.id, name: user.name, username: user.username, email: user.email},
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



    
