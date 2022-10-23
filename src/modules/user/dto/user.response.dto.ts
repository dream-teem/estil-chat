import {  Type } from 'class-transformer';
import {  IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import type { UserPicture, UserPictureThumbnails } from '../user.interface';

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
