import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class ConfirmVerificationRequestDto {
  @IsString()
  @IsNotEmpty()
  smsCode!: string;

  @IsUUID()
  @IsNotEmpty()
  verificationId!: string;
}
