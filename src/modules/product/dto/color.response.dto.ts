import { ApiProperty } from '@nestjs/swagger';

export class ColorResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  hex!: string;

  @ApiProperty()
  order!: number;

  @ApiProperty()
  code!: string;
}
