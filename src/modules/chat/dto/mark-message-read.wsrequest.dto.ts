import { IsNumber, IsString } from 'class-validator';

export class MarkMessageReadWSRequestDto {
  @IsString()
  chatId!: string;

  @IsNumber()
  senderId!: number;
}
