import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

import { FollowingEntity } from './following.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FollowingEntity,
    ]),
  ],
  providers: [],
  exports: [],
})
export class FollowingModule {}
