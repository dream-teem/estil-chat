import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseMetaDto {
  @ApiProperty()
  hasMore!: boolean;

  @ApiProperty()
  limit!: number;
}

export class PaginatedResponseDto<T = any> {
  @ApiProperty()
  data!: T;

  @ApiProperty({ type: PaginatedResponseMetaDto })
  meta!: PaginatedResponseMetaDto;
}
