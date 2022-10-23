import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { ColorResponseDto } from '../dto/color.response.dto';
import { ColorEntity } from '../entities/color.entity';

@Injectable()
export class ColorService {
  constructor(@InjectRepository(ColorEntity) private colorRepository: Repository<ColorEntity>) {}

  public async getColors(): Promise<ColorResponseDto[]> {
    return this.colorRepository.find({});
  }
}
