import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty({ nullable: true })
  parentId!: number | null;

  @ApiProperty({ nullable: true })
  sizeGroupId!: number | null;

  @ApiProperty()
  order!: number;

  @ApiProperty()
  path!: string;
}
