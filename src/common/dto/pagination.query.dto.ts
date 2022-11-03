import { Transform } from 'class-transformer';
import { IsNumber,  IsOptional, Max } from 'class-validator';

export class PaginationQueryDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  offset: number = 0;

  @IsNumber()
  @Max(100)
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  limit: number = 25;
}

