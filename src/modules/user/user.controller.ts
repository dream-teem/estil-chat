import {
  Body,
  Controller,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse } from '@nestjs/swagger';

import { ReqUser } from '@/common';
import { UseAuth } from '@/common/decorators/auth.decorator';
import { ReqUserId } from '@/common/decorators/req-user-id.decorator';
import { PaginatedResponseDto } from '@/common/dto/pagination.response.dto';

import type { Payload } from '../auth';
import { UpdateUserRequestDto } from './dto/update-user.request.dto';
import { UserProductsQueryDto } from './dto/user-products.query.dto';
import { UserProfileResponseDto } from './dto/user-profile.response.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { UserProductService } from './services/user-product.service';
import { UserService } from './services/user.service';
import type { UserPicture } from './user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly user: UserService, private readonly product: UserProductService) {}

  @ApiResponse({ type: 'object' })
  @Get('check-username/:username')
  public async checkUsername(@Param() username: string): Promise<Record<'exists', boolean>> {
    return this.user.checkUsername(username);
  }

  @UseAuth()
  @ApiResponse({ type: UserResponseDto })
  @Get('profile')
  public async getProfile(@ReqUser() user: Payload): Promise<UserResponseDto> {
    return this.user.getProfile(user.userId);
  }

  @ApiResponse({ type: UserProfileResponseDto })
  @Get('/:username/profile')
  public async getProfileByUsername(@Param('username') username: string, @ReqUserId() viewerId?: number): Promise<UserProfileResponseDto> {
    return this.user.getProfileByUsername(username, viewerId);
  }

  @ApiResponse({ type: PaginatedResponseDto })
  @Get(':userId/products')
  public async getProductByUserId(
    @Param('userId') userId: number,
      @ReqUserId() viewerId: number | null,
      @Query() query: UserProductsQueryDto,
  ): Promise<PaginatedResponseDto> {
    return this.product.getProductByUserId(userId, viewerId, query);
  }

  @UseAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ type: 'object' })
  @Post('images/uploadImage')
  public async saveProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 4 * 1024 * 1024 })],
      }),
    )
      file: Express.Multer.File,
      @ReqUser() user: Payload,
  ): Promise<UserPicture> {
    return this.user.uploadProfileImage(user.userId, file.buffer);
  }

  @UseAuth()
  @ApiResponse({ type: 'object' })
  @Put('')
  public async updateUser(@Body() dto: UpdateUserRequestDto, @ReqUser() user: Payload): Promise<void> {
    return this.user.updateUser(user.userId, dto);
  }
}
