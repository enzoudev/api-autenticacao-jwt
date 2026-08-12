import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService} from '@nestjs/jwt'
import { CreateUserDto} from './dto/create-user.dto';


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


    
}



    
