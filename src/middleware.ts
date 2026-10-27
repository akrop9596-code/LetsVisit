import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role;

  // Admin routes
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn || userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Owner routes
  if (pathname.startsWith('/owner')) {
    if (!isLoggedIn || (userRole !== 'PROPERTY_OWNER' && userRole !== 'ADMIN')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Protected routes (require login)
  const protectedPaths = ['/profile', '/favorites', '/trip-planner'];
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Redirect logged-in users away from auth pages
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/admin/:path*',
    '/owner/:path*',
    '/profile/:path*',
    '/favorites/:path*',
    '/trip-planner/:path*',
    '/login',
    '/register',
  ],
};
