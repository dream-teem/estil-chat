import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CategoryResponseDto } from './category.response.dto';

export class AggregatedCategoryResponseDto extends OmitType(CategoryResponseDto, ['sizeGroupId'] as const) {
  @ApiProperty()
  subCategories!: number[];

  @ApiProperty()
  sizeGroups!: number[];
}
