import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CategoryResponseDto } from './category.response.dto';

export class CategoryTreeResponseDto extends OmitType(CategoryResponseDto, ['sizeGroupId'] as const) {
  @ApiProperty()
  subCategories!: CategoryTreeResponseDto[];

  @ApiProperty()
  sizeGroups!: number[];
}
