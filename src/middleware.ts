import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/universities',
    '/(auth)/signin',
    '/(auth)/signup',
    '/(auth)/error',
    '/(auth)/verify-request',
    '/api/universities',
    '/api/health',
  ];

  // Check if the path is public
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route.split('(')[0])
  );

  // API routes that don't require authentication
  if (pathname.startsWith('/api/')) {
    // Allow all API routes including auth
    return NextResponse.next();
  }

  // Auth routes (special handling)
  if (pathname.startsWith('/(auth)/')) {
    return NextResponse.next();
  }

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For all other routes, check if user is authenticated
  // This is a simplified check - in production, you'd verify the session token
  const sessionToken = request.cookies.get('next-auth.session-token');

  if (!sessionToken && !request.cookies.get('__Secure-next-auth.session-token')) {
    // Not authenticated - redirect to sign in
    const signInUrl = new URL('/(auth)/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};