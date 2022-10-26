import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { ReqUser } from '@/common';
import { UseAuth } from '@/common/decorators/auth.decorator';
import { ReqUserId } from '@/common/decorators/req-user-id.decorator';
import type { Payload } from '@/modules/auth';

import { FollowUserResponseDto } from './dto/follow-user.response.dto';
import { FollowingService } from './following.service';

@Controller('follows')
export class FollowingController {
  constructor(private readonly following: FollowingService) {}

  @UseAuth()
  @Patch('user/:followingUserId')
  public async toggleFollow(@Param('followingUserId') followingUserId: number, @ReqUser() user: Payload): Promise<void> {
    return this.following.toggleUserFollow(followingUserId, user.userId);
  }

  @ApiResponse({ type: [FollowUserResponseDto] })
  @Get(':userId/followers')
  public async getFollowersByUserId(
    @ReqUserId() viewerId: number | undefined,
      @Param('userId') userId: number,
  ): Promise<FollowUserResponseDto[]> {
    return this.following.getFollowersByUserId(userId, viewerId);
  }

  @ApiResponse({ type: [FollowUserResponseDto] })
  @Get(':userId/followings')
  public async getFollowingsByUserId(
    @ReqUserId() viewerId: number | undefined,
      @Param('userId') userId: number,
  ): Promise<FollowUserResponseDto[]> {
    return this.following.getFollowingsByUserId(userId, viewerId);
  }
}
