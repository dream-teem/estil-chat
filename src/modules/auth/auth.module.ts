import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from '@/common';
import { UserEntity } from '@/modules/user/user.entity';
import { UserModule } from '@/modules/user/user.module';

import { VerificationModule } from '../verification/verification.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtVerifyStrategy, JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    UserModule,
    VerificationModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('auth.jwtSecret'),
        signOptions: { expiresIn: config.get('auth.jwtExpiration') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtVerifyStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
