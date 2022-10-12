import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';
import moment from 'moment';
import type { Repository } from 'typeorm';

import { ConfigService } from '@/common';
import { UserEntity, UserService } from '@/modules/user';

import type { JwtPayload, JwtSign, Payload } from './auth.interface';
import type { SignupDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private user: UserService,
    private config: ConfigService,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
  ) {}

  public async signup(dto: SignupDto): Promise<UserEntity> {
    const exists = await this.userRepository.findOne({ where: { username: dto.username } });
    if (exists) throw new BadRequestException('Username already exists');

    const user = this.userRepository.create(dto);
    user.password = await this.hashPassword(user.password);

    await this.userRepository.save(user);

    return user;
  }

  public async validateUser(username: string, password: string): Promise<Omit<UserEntity, 'password'> | null> {
    const user = await this.user.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: pass, ...result } = user;
      return result;
    }

    return null;
  }

  public validateRefreshToken(data: Payload, refreshToken: string): boolean {
    if (!this.jwt.verify(refreshToken, { secret: this.config.get('auth.jwtRefreshSecret') })) {
      return false;
    }

    const payload = <{ sub: string }> this.jwt.decode(refreshToken);
    return Number(payload.sub) === data.userId;
  }

  public jwtSign(data: Payload): JwtSign {
    const payload: JwtPayload = { sub: data.userId, username: data.username, role: data.role };

    return {
      access_token: this.jwt.sign(payload),
      refresh_token: this.getRefreshToken(payload.sub),
    };
  }

  public setAuthCookie(res: Response, user: Payload): void {
    const token = this.jwtSign(user);

    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: this.config.get('auth.cookieSecure'),
      expires: moment().add(1, 'year').toDate(),
    });
    res.cookie('refresh_token', token.refresh_token, {
      httpOnly: true,
      secure: this.config.get('auth.cookieSecure'),
      expires: moment().add(1, 'year').toDate(),
    });
  }

  public removeAuthCookie(res: Response): void {
    res.cookie('access_token', '', { maxAge: 0 });
    res.cookie('refresh_token', '', { maxAge: 0 });
  }

  private getRefreshToken(sub: number): string {
    return this.jwt.sign(
      { sub },
      {
        secret: this.config.get('auth.jwtRefreshSecret'),
        expiresIn: this.config.get('auth.jwtRefreshExpiration'),
      },
    );
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
}
