import { ApiProperty } from '@nestjs/swagger';

export class SendVerificationResponseDto {
  @ApiProperty()
  verificationId!: string;

  @ApiProperty()
  isVerified!: boolean;
}
