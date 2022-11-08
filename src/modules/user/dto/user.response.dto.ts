import { ApiProperty } from '@nestjs/swagger';
import type { UserPicture, UserRole } from '../user.interface';

export class UserResponseDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  role!: UserRole | null;
  
  @ApiProperty()
  username!: string;
  
  @ApiProperty()
  email!: string;
  
  @ApiProperty()
  phone!: string;
  
  @ApiProperty()
  name!: string | null;
  
  @ApiProperty()
  description!: string | null;
  
  @ApiProperty()
  cityId!: number | null;
  
  @ApiProperty({type: 'object'})
  picture!: UserPicture | null;
  
  @ApiProperty()
  lastLoggedIn!: Date;
}