import type { USER_PICTURE_THUMBNAILS } from './user.constant';

export type UserPictureSizeAll = typeof USER_PICTURE_THUMBNAILS;
export type UserPictureSize = UserPictureSizeAll[number];

export type UserPictureThumbnails = Record<UserPictureSize, string>;

export interface UserPicture {
  original: string;
  thumbnails: UserPictureThumbnails;
}

export interface User {
  role: UserRole | null;
  username: string;
  email: string;
  phone: string;
  countryCode: string;
  password: string;
  balance: number;
  name: string | null;
  description: string | null;
  cityId: number | null;
  picture: UserPicture | null;
  lastLoggedIn: Date;
  whatsapp: string | null;
}

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}
