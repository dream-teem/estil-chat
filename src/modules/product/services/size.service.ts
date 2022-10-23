import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';

import type { SizeGroupResponseDto } from '../dto/size-group.response.dto';
import { SizeGroupEntity } from '../entities/size-group.entity';
import { SizeEntity } from '../entities/size.entity';
import type { Size } from '../interfaces/product-size.interface';

@Injectable()
export class SizeService {
  constructor(
    @InjectRepository(SizeEntity) private sizeRepository: Repository<SizeEntity>,
    @InjectRepository(SizeGroupEntity) private sizeGroupRepository: Repository<SizeGroupEntity>,
  ) {}

  public async getSizeGroupsById(): Promise<Record<number, SizeGroupResponseDto>> {
    const sizeGroups = await this.sizeGroupRepository
      .createQueryBuilder('sg')
      .select([
        'sg.id as id',
        'sg.title as title',
        'sg.slug as slug',
        'sg."order" as "order"',
        `COALESCE(
            json_agg(
                s
                ORDER BY s."order"::int asc
            ),
            '{}'
        ) AS sizes`,
      ])
      .leftJoin(TableName.SIZE, 's', 's.sizeGroupId=sg.id')
      .groupBy('sg.id')
      .getRawMany<SizeGroupResponseDto>();

    return _.keyBy(sizeGroups, 'id');
  }

  public async getSizes(): Promise<Size[]> {
    return this.sizeRepository.find();
  }
}
