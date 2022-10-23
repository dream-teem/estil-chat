import { PickType } from '@nestjs/swagger';
import { SendVerificationResponseDto } from './send-verification.response.dto';

export class ConfirmVerificationResponseDto extends PickType(SendVerificationResponseDto, ['isVerified'] as const) {}
