import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigService } from '@/common';
import { UserEntity, UserModule } from '@/modules/user';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtVerifyStrategy, JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    UserModule,
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
