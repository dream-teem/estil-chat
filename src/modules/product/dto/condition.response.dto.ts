import { ApiProperty } from '@nestjs/swagger';

export class ConditionResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  explanation!: string;

  @ApiProperty()
  order!: number;
}
