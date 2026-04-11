import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if session cookie exists
  const session = request.cookies.get('courssa_session');
  
  // Define protected routes that require authentication
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/client') || 
    request.nextUrl.pathname.startsWith('/driver');
  
  // Exclude auth routes and public assets from checks
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');

  // If user is trying to access a protected route without a session, redirect to auth
  if (isProtectedRoute && !session && !isAuthRoute) {
    const url = new URL('/auth', request.url);
    // Optional: add ?callbackUrl= to remember where they wanted to go
    return NextResponse.redirect(url);
  }

  // If a logged-in user tries to enter '/auth', you could optionally redirect them to their dashboard
  // Leaving this out for now to allow them to switch accounts easily.

  return NextResponse.next();
}

// Config to specify which routes should be processed by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - icon.png, apple-touch-icon.png (app icons)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icon.png|apple-touch-icon.png).*)',
  ],
};
