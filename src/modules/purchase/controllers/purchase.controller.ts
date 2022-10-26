import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { ReqUser } from '@/common';
import { UseAuth } from '@/common/decorators/auth.decorator';
import type { Payload } from '@/modules/auth';

import { PurchaseProductRequestDto } from '../dto/purchase-product.request.dto';
import { PurchaseResponseDto } from '../dto/purchase.response.dto';
import { PurchaseService } from '../purchase.service';

@Controller('purchase')
export class PurchaseController {
  constructor(
    private readonly purchase: PurchaseService,
  ) {}

  @UseAuth()
  @ApiResponse({ type: [PurchaseResponseDto] })
  @Get('byUser')
  public async getPurchasesByUserId(@ReqUser() user: Payload): Promise<PurchaseResponseDto[]> {
    return this.purchase.getPurchasesByUserId(user.userId);
  }

  @UseAuth()
  @Post('')
  public async purchaseProduct(@Body() dto: PurchaseProductRequestDto, @ReqUser() user: Payload): Promise<void> {
    return this.purchase.purchaseProduct(user, dto);
  }
}
