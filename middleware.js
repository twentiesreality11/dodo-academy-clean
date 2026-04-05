import { NextResponse } from 'next/server';

export function middleware(request) {
  const session = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  // Public paths (no authentication required)
  const publicPaths = ['/login', '/register', '/', '/critical', '/consultancy', '/foundation'];
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'));
  
  // Protected routes
  const protectedPaths = ['/foundation/dashboard', '/foundation/lesson', '/foundation/assessment'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  // If trying to access protected route without session, redirect to login
  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and trying to access login/register, redirect to dashboard
  if (session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/foundation/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};