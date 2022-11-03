import type { User } from '@/modules/user/user.interface';

export interface JwtSign {
  access_token: string;
  refresh_token: string;
}

export interface JwtPayload extends Pick<User, 'username' | 'role'> {
  sub: number;
}

export interface Payload extends Pick<User, 'username' | 'role'> {
  userId: number;
}
