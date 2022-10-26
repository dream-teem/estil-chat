import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

import { FollowingController } from './following.controller';
import { FollowingEntity } from './following.entity';
import { FollowingService } from './following.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FollowingEntity,
    ]),
  ],
  controllers: [FollowingController],
  providers: [FollowingService],
  exports: [],
})
export class FollowingModule {}
