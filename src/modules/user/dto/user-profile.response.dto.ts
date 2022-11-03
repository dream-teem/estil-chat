import { PickType } from '@nestjs/swagger';
import { UserResponseDto } from './user.response.dto';

export class UserProfileResponseDto extends PickType(UserResponseDto, ['username', 'id', 'picture', 'description', 'name'] as const) {
    followers!: number;
    following!: number;
    rating!: {
        count: number;
        rating: number;
    }
    productCount!: number;
    moderator!: boolean;
    isFollowed?: boolean;
    lastLoggedIn!: string;
}
