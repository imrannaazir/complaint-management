import { Role, User } from '@prisma/client';

export type TRegisterPayload = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type TLoginPayload = Pick<User, 'email' | 'password'>;
export type TJwtPayload = {
  email: string;
  id: string;
  fullName: string;
  role: Role;
  iat?: number;
  exp?: number;
};

export type TLoginReturn = {
  accessToken: string;
  refreshToken: string;
};
