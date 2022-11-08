import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import type { UserPictureThumbnails, UserPicture } from '../user.interface';

export class UserPictureThumbnailsDto implements UserPictureThumbnails {
  @IsString()
  @IsNotEmpty()
  75!: string;

  @IsString()
  @IsNotEmpty()
  150!: string;

  @IsString()
  @IsNotEmpty()
  428!: string;
}

export class UserPictureDto implements UserPicture {
  @IsString()
  original!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserPictureThumbnailsDto)
  thumbnails!: UserPictureThumbnails;
}

export class UpdateUserRequestDto {
  @IsString()
  @IsOptional()
  name!: string;

  @IsString()
  @IsOptional()
  description!: string | null;

  @IsNumber()
  @IsOptional()
  cityId!: number | null;

  @IsOptional()
  @ValidateNested()
  @Type(()=>UserPictureDto)
  picture!: UserPictureDto | null;
}
