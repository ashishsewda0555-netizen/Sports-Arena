import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login if it exists, though we use /login)
  if (pathname.startsWith('/admin')) {
    if (!token) {
      // Redirect to login if no token cookie exists
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Basic role check for User Management by decoding the JWT payload
    // Note: We don't verify the signature here because standard 'jsonwebtoken' 
    // doesn't run on Edge runtime, but it's sufficient for UX routing. 
    // The real API endpoints will reject unauthorized requests.
    if (pathname.startsWith('/admin/users')) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        
        if (payload.role !== 'admin') {
          // Redirect editors away from user management
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
      } catch (e) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  // Prevent authenticated users from seeing the login page
  if (pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
