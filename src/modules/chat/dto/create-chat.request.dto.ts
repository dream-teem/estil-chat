import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, IsOptional, IsNumber, ValidateNested,  IsArray, ArrayMinSize } from 'class-validator';
import _ from 'lodash';

export class ChatMemberDto {
  @ApiProperty()
  @IsNumber()
  userId!: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pictureUrl?: string;
}

export class CreateChatRequestDto {
  @ApiProperty()
  @IsArray()
  @Transform(({ value }) => _.uniqBy(<ChatMemberDto[]>value, ({ userId }) => userId))
  @ArrayMinSize(2)
  @ValidateNested()
  @Type(() => ChatMemberDto)
  members!: ChatMemberDto[];
}
