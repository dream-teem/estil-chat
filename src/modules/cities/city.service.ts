import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { CityEntity } from './city.entity';
import type { CityResponseDto } from './dto/city.response.dto';

@Injectable()
export class CityService {
  constructor(@InjectRepository(CityEntity) private cityRepository: Repository<CityEntity>) {}

  public async getAll(): Promise<CityResponseDto[]> {
    return this.cityRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }
}
