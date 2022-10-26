import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { ReqUser } from '@/common';
import { UseAuth } from '@/common/decorators/auth.decorator';
import { ReqUserId } from '@/common/decorators/req-user-id.decorator';
import type { Payload } from '@/modules/auth';

import { LikedProductResponseDto } from './dto/liked-product.response.dto';
import { ProductLikeService } from './product-like.service';

@Controller('likes')
export class ProductLikeController {
  constructor(private readonly productLike: ProductLikeService) {}

  @UseAuth()
  @Patch('product/:productId')
  public async toggleFollow(@Param('productId') productId: number, @ReqUser() user: Payload): Promise<void> {
    return this.productLike.toggleProductLike(productId, user.userId);
  }

  @ApiResponse({ type: [LikedProductResponseDto] })
  @Get('user/:userId')
  public async getFollowersByUserId(
    @ReqUserId() viewerId: number | undefined,
      @Param('userId') userId: number,
  ): Promise<LikedProductResponseDto[]> {
    return this.productLike.getLikedProductsByUserId(userId, viewerId);
  }
}
