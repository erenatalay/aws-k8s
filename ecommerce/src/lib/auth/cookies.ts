import { serialize } from 'cookie';

const ACCESS_COOKIE = 'auth_access';
const REFRESH_COOKIE = 'auth_refresh';

const cookieOpts = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax' as const,
  // Default true for security, set COOKIE_SECURE=false to disable (e.g., for local HTTP)
  secure: process.env.COOKIE_SECURE !== 'false',
  // Allow sharing across subdomains for .local domains
  domain: process.env.COOKIE_DOMAIN || undefined,
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
