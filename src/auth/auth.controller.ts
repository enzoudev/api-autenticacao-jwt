import { Controller, Post, Body, Get, Req, ConflictException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, LoginUserDto } from './dto/login-dto.dto';
import { MailService } from './mail.service';


@Controller('auth')
export class AuthController{
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }


    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: any) {
        
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: any) {

    return this.authService.validateGoogleUser(req.user);
    }


    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto.email)
    }
}