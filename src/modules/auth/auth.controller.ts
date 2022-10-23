import { Controller, Get, Post, Res, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { ReqUser } from '@/common';
import type { UserEntity } from '@/modules/user';

import { AuthService, Payload, JwtAuthGuard, JwtVerifyGuard, LocalAuthGuard, JwtSign } from '.';
import { VerificationService } from '../verification/verification.service';
import { ConfirmVerificationRequestDto } from './dto/confirm-verification.request.dto';
import { ConfirmVerificationResponseDto } from './dto/confirm-verification.response.dto';
import { SendVerificationRequestDto } from './dto/send-verification.request.dto';
import { SendVerificationResponseDto } from './dto/send-verification.response.dto';
import { SignupRequestDto } from './dto/signup.request.dto';

/**
 * https://docs.nestjs.com/techniques/authentication
 */
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private verification: VerificationService) {}

  @Post('signup')
  public async signup(
    @Body() signupDto: SignupRequestDto,
      @Res({ passthrough: true }) res: Response,
  ): Promise<Pick<UserEntity, 'username'>> {
    const user = await this.auth.signup(signupDto);

    this.auth.setAuthCookie(res, { userId: user.id, username: user.username, role: user.role });

    return { username: user.username };
  }

  /**
   * See test/e2e/local-auth.spec.ts
   * need username, password in body
   * skip guard to @Public when using global guard
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  public login(@ReqUser() user: UserEntity, @Res({ passthrough: true }) res: Response): Pick<UserEntity, 'username'> {
    this.auth.setAuthCookie(res, { userId: user.id, username: user.username, role: user.role });

    return { username: user.username };
  }

  @Get('logout')
  public logout(@Res({ passthrough: true }) res: Response): void {
    this.auth.removeAuthCookie(res);
  }

  @Post('/verification/confirm')
  @ApiResponse({ type: ConfirmVerificationResponseDto, status: 200 })
  public async confirmVerification(@Body() data: ConfirmVerificationRequestDto): Promise<ConfirmVerificationResponseDto> {
    return this.verification.confirmVerification(data);
  }

  @Post('/verification/send')
  @ApiResponse({ type: SendVerificationResponseDto, status: 200 })
  public async sendVerification(@Body() data: SendVerificationRequestDto): Promise<SendVerificationResponseDto> {
    return this.auth.sendVerification(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('jwt/check')
  public jwtCheck(@ReqUser() user: Payload): Payload {
    return user;
  }

  // Only verify is performed without checking the expiration of the access_token.
  @UseGuards(JwtVerifyGuard)
  @Post('jwt/refresh')
  public jwtRefresh(@ReqUser() user: Payload, @Req() req: Request, @Res({ passthrough: true }) res: Response): void {
    const refresh = (<Partial<JwtSign>>req.cookies).refresh_token;

    if (!refresh || !this.auth.validateRefreshToken(user, refresh)) {
      throw new UnauthorizedException('InvalidRefreshToken');
    }

    this.auth.setAuthCookie(res, user);
  }
}
