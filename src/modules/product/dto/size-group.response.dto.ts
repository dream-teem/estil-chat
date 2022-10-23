import { ApiProperty } from '@nestjs/swagger';

class SizeResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  sizeGroupId!: number;

  @ApiProperty()
  order!: number;
}

export class SizeGroupResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  order!: number;

  @ApiProperty({type: [SizeResponseDto]})
  sizes!: SizeResponseDto[];
}
