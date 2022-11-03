import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

import { ProductEntity } from '../product/entities/product.entity';
import { UserProductService } from './services/user-product.service';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity, ProductEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserProductService],
  exports: [UserService],
})
export class UserModule {}
