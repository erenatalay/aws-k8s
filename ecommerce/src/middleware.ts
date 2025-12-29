import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const isAuthPage =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register');
  const isProtectedPage =
    request.nextUrl.pathname.startsWith('/products') ||
    request.nextUrl.pathname.startsWith('/dashboard');

  // Redirect to login if trying to access protected page without token
  if (isProtectedPage && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to products if logged in and trying to access auth pages
  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL('/products', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/products/:path*', '/dashboard/:path*', '/login', '/register'],
};
