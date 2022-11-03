import type { UserPicture } from '@/modules/user/user.interface';
import { ApiProperty } from '@nestjs/swagger';

export class FollowUserResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  username!: string;

  @ApiProperty({ type: 'object' })
  picture!: UserPicture;

  @ApiProperty()
  isFollowed!: boolean;
}

