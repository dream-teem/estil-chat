import { ApiProperty } from '@nestjs/swagger';
import {  Type } from 'class-transformer';
import {  IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import type {  UserPicture, UserPictureThumbnails, UserRole } from '../user.interface';

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
  
  @ApiProperty()
  picture!: UserPictureDto | null;
  
  @ApiProperty()
  lastLoggedIn!: Date;
}