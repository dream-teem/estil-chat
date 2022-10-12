export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  role: UserRole | null;
}

export enum UserRole {
  ADMIN = 'admin',
}
