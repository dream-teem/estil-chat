import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class SignupRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => (<string>value).toLowerCase().trim())
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (<string>value).toLowerCase().trim())
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsNumber()
  @IsOptional()
  cityId?: number;

  @IsUUID()
  @IsNotEmpty()
  verificationId!: string;
}
