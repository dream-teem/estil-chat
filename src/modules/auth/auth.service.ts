import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import type { Response } from 'express';
import _ from 'lodash';
import moment from 'moment';
import type { Repository } from 'typeorm';

import { ConfigService, UtilService } from '@/common';
import { UserEntity, UserService } from '@/modules/user';

import { VerificationService } from '../verification/verification.service';
import type { JwtPayload, JwtSign, Payload } from './auth.interface';
import type { SendVerificationRequestDto } from './dto/send-verification.request.dto';
import type { SendVerificationResponseDto } from './dto/send-verification.response.dto';
import type { SignupRequestDto } from './dto/signup.request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly user: UserService,
    private readonly config: ConfigService,
    private readonly verification: VerificationService,
    private readonly utils: UtilService,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
  ) {}

  public async signup({ verificationId, ...data }: SignupRequestDto): Promise<UserEntity> {
    const verification = await this.verification.getVerificationById(verificationId);

    if (!verification?.isVerified) throw new BadRequestException('Аккаунт не верифицирован');

    const userPhone = _.pick(verification, ['phone', 'countryCode']);

    const exists = await this.userRepository.findOne({
      where: [{ username: data.username }, { email: data.email }, userPhone],
    });
    if (exists) throw new ConflictException('Username already exists');

    const user = this.userRepository.create({ ...data, ...userPhone });
    user.password = await this.hashPassword(user.password);

    await this.userRepository.save(user);

    return user;
  }

  public async sendVerification(data: SendVerificationRequestDto): Promise<SendVerificationResponseDto> {
    const phone = this.utils.parsePhoneNumber(data.phone, data.countryCode);

    const user = await this.userRepository.findOne({ where: { phone: phone.national, countryCode: phone.countryCode } });

    if (user) {
      throw new ConflictException('Данный телефон уже привязан к другому аккаунту');
    }

    return this.verification.sendVerification(phone);
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

  public jwtVerify(token: string): JwtPayload {
    return this.jwt.verify(token);
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
