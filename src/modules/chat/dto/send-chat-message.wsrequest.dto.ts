import { IsNumber, IsString, MaxLength } from 'class-validator';

export class SendChatMessageWSRequestDto {
  @IsNumber()
  receiverId!: number;

  @IsString()
  chatId!: string;

  @IsString()
  @MaxLength(1000)
  text!: string;
}
