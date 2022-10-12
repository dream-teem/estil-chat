import { Controller, Get, Post, Res, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';

import { ReqUser } from '@/common';
import type { UserEntity } from '@/modules/user';

import { AuthService, Payload, JwtAuthGuard, JwtVerifyGuard, LocalAuthGuard, JwtSign } from '.';
import { SignupDto } from './dto';

/**
 * https://docs.nestjs.com/techniques/authentication
 */
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  public async signup(@Body() signupDto: SignupDto, @Res({ passthrough: true }) res: Response): Promise<Pick<UserEntity, 'username'>> {
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
