import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

import { CityEntity } from './city.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CityEntity,
    ]),
  ],
  providers: [],
  exports: [],
})
export class CityModule {}
