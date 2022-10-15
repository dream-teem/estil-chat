import { Type } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

class ChatMessageDto {
  @IsString()
  id?: string;

  @IsDateString()
  timestamp!: Date;

  @IsNumber()
  userId!: number;

  @IsString()
  text!: string;
}

export class NewChatMessageWSResponseDto {
  @IsString()
  chatId!: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ChatMessageDto)
  message?: ChatMessageDto;
}
