import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersService {
    constructor (private readonly prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
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

}


