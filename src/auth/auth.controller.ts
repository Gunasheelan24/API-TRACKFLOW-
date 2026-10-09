import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import type { Request, Response } from 'express';
import { sentEmailOtp } from './dto/verifyEmailAddress';
import type { RefreshRequest } from './types/auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  createAccount(@Body() createUserDto: CreateUserDto) {
    return this.authService.createAccount(createUserDto);
  }

  @Post('signin')
  loginController(
    @Body() signIn: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.loginService(signIn, response);
  }

  @Post('refresh')
  getAccessToken(@Req() request: RefreshRequest) {
    return this.authService.getRefreshToken(request);
  }

  @Post('sent-otp')
  sentEmailOtp(@Body() verifyEmailDto: sentEmailOtp) {
    return this.authService.sentEmailOtp(verifyEmailDto);
  }
}
