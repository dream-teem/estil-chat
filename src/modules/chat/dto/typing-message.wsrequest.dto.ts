import { IsNumber, IsString } from 'class-validator';

export class TypingMessageWSRequestDto {
  @IsString()
  chatId!: string;

  @IsNumber()
  receiverId!: number;
}
