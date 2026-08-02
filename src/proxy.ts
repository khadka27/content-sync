import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'content-sync-super-secret-key-2026';

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Proxy Rewrites
  if (pathname === '/proxy-image' && searchParams.has('url')) {
    const url = new URL('/api/image-proxy', request.url);
    url.searchParams.set('url', searchParams.get('url')!);
    return NextResponse.rewrite(url);
  }

  if (pathname === '/proxy' && searchParams.has('url')) {
    const url = new URL('/api/proxy', request.url);
    url.searchParams.set('url', searchParams.get('url')!);
    return NextResponse.rewrite(url);
  }

  // 2. NextAuth Session Verification
  const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
  const hasNextAuthCookie =
    request.cookies.has('next-auth.session-token') ||
    request.cookies.has('__Secure-next-auth.session-token') ||
    request.cookies.has('contentsync_session');

  const isAuthenticated = !!token || hasNextAuthCookie;

  // 3. Protected Dashboard Routes Check
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. If already authenticated and visits / or /login, redirect to /dashboard
  if ((pathname === '/' || pathname === '/login') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 5. CORS Headers for API & Proxy requests
  const response = NextResponse.next();
  if (pathname.startsWith('/api') || pathname.startsWith('/proxy')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
}

export default proxy;

export const config = {
  matcher: ['/', '/dashboard/:path*', '/login', '/api/:path*', '/proxy', '/proxy-image'],
};
