export type UserPictureType = 75 | 150 | 428;
export type UserPictureThumbnails = Record<UserPictureType, string>;

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
