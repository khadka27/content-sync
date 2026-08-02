import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
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

  // 2. Cookie & Session Proxying
  const response = NextResponse.next();
  const sessionCookie = request.cookies.get('contentsync_session');

  // Inject default session cookie for dashboard access if missing
  if (pathname.startsWith('/dashboard') && !sessionCookie) {
    const defaultSession = JSON.stringify({
      userId: 'usr-default',
      email: 'khadka@contentsync.ai',
      loggedInAt: new Date().toISOString(),
    });
    response.cookies.set('contentsync_session', defaultSession, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  // Set global CORS headers for proxy and API calls
  if (pathname.startsWith('/api') || pathname.startsWith('/proxy')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
}

export const proxy = middleware;

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*', '/proxy', '/proxy-image'],
};
