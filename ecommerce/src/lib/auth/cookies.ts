import { serialize } from 'cookie';

const ACCESS_COOKIE = 'auth_access';
const REFRESH_COOKIE = 'auth_refresh';

const cookieOpts = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
} satisfies Parameters<typeof serialize>[2];

export const buildAccessCookie = (token: string): string =>
  serialize(ACCESS_COOKIE, token, cookieOpts);

export const buildRefreshCookie = (token: string): string =>
  serialize(REFRESH_COOKIE, token, cookieOpts);

export const clearAccessCookie = (): string =>
  serialize(ACCESS_COOKIE, '', { ...cookieOpts, maxAge: 0 });

export const clearRefreshCookie = (): string =>
  serialize(REFRESH_COOKIE, '', { ...cookieOpts, maxAge: 0 });

export const readCookie = (
  cookieHeader: string | undefined,
  name: string,
): string | null => {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(/; */);
  for (const part of parts) {
    const [key, ...rest] = part.split('=');
    if (key === name) return rest.join('=');
  }
  return null;
};
