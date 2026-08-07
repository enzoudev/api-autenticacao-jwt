import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { UsersService} from './users.service'
import { LoginUserDto, CreateUserDto} from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor (private readonly usersService: UsersService) {}


    @Post()
    create(@Body() createUserDto: CreateUserDto) {

        return this.usersService.create(createUserDto)

    }

    @Post('login')
    login(@Body() loginUserDto: LoginUserDto) {

            return this.usersService.login(loginUserDto)
        }
    

}
