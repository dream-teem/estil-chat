import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (<string>value).toLowerCase().trim())
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
