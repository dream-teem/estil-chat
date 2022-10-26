import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

import { CityController } from './city.controller';
import { CityEntity } from './city.entity';
import { CityService } from './city.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CityEntity,
    ]),
  ],
  controllers: [CityController],
  providers: [CityService],
  exports: [],
})
export class CityModule {}
