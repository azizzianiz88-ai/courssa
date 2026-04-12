import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('courssa_session')?.value;
  const role    = request.cookies.get('courssa_role')?.value;
  const path    = request.nextUrl.pathname;

  const isProtected = path.startsWith('/client') || path.startsWith('/driver') || path.startsWith('/admin');
  const isAuthRoute = path.startsWith('/auth');
  const isApiRoute  = path.startsWith('/api');

  // Skip API routes
  if (isApiRoute) return NextResponse.next();

  // No session → redirect to auth
  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Role-based access control
  if (session && isProtected) {
    // Prevent clients from accessing driver pages
    if (path.startsWith('/driver') && role === 'CLIENT') {
      return NextResponse.redirect(new URL('/client', request.url));
    }
    // Prevent drivers from accessing client pages
    if (path.startsWith('/client') && role === 'DRIVER') {
      return NextResponse.redirect(new URL('/driver', request.url));
    }
    // Prevent non-admins from accessing admin pages
    if (path.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  // Logged-in user trying to go to /auth → send them to their dashboard
  if (isAuthRoute && session && role) {
    const dashMap: Record<string, string> = {
      ADMIN: '/admin', CLIENT: '/client', DRIVER: '/driver'
    };
    const dest = dashMap[role];
    if (dest) return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon.png|apple-touch-icon.png).*)',
  ],
};
