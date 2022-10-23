import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { ConditionResponseDto } from '../dto/condition.response.dto';
import { ProductConditionEntity } from '../entities/product-condition.entity';

@Injectable()
export class ConditionService {
  constructor(@InjectRepository(ProductConditionEntity) private conditionRepository: Repository<ProductConditionEntity>) {}

  public async getConditions(): Promise<ConditionResponseDto[]> {
    return this.conditionRepository.find({
      order: {
        order: 'ASC',
      },
    });
  }
}
