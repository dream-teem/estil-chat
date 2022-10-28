import { ApiProperty } from "@nestjs/swagger";

export class CreatePurchaseResponseDto {
    @ApiProperty()
    chargeUrl!: string
}