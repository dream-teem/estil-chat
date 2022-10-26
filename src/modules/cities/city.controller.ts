import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { UseCache } from '@/common/decorators/cache.decorator';

import { CityService } from './city.service';
import { CityResponseDto } from './dto/city.response.dto';

@Controller('cities')
export class CityController {
  constructor(private readonly city: CityService) {}

  @UseCache()
  @ApiResponse({ type: [CityResponseDto] })
  @Get('')
  public async getAll(): Promise<CityResponseDto[]> {
    return this.city.getAll();
  }
}
