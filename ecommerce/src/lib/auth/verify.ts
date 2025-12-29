import { NextRequest } from 'next/server';

import { db, DbUser } from '@/db/mock';

import { readAuthCookie } from './cookies';

export const getUserFromCookie = (request: NextRequest): DbUser | null => {
  const token = readAuthCookie(request.cookies.get('auth_token')?.value);
  if (!token) return null;
  const payload = db.verifyToken(token);
  if (!payload) return null;
  const user = db.users.find((u) => u.id === payload.sub) ?? null;
  return user;
};
