// =====================================================
// XHETON v0.0.012 - Route Protection Middleware
// Protect routes based on authentication and subscription status
// =====================================================

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'xheton-secret-key-change-in-production';

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/api/auth/login',
  '/api/auth/signup',
];

// Routes that require authentication but not subscription
const AUTH_ONLY_ROUTES = [
  '/auth/check-status',
  '/onboarding/start',
  '/onboarding/plan',
  '/api/onboarding/start',
  '/api/onboarding/plan',
  '/api/auth/check-status',
  '/api/auth/logout',
];

// Protected routes that require both auth and active subscription
const PROTECTED_ROUTES_PREFIXES = [
  '/dashboard',
  '/sales',
  '/inventory',
  '/customers',
  '/suppliers',
  '/products',
  '/purchases',
  '/accounting',
  '/hr',
  '/payroll',
  '/settings',
  '/reports',
  '/analytics',
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if route starts with /api (skip middleware for API routes, they handle their own auth)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Get auth token from cookie
  const token = request.cookies.get('xheton_auth_token')?.value;

  // If no token, redirect to login
  if (!token) {
    if (!pathname.startsWith('/auth/')) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Verify token
  let decoded = null;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // Token verification failed
    decoded = null;
  }

  if (!decoded) {
    // Invalid token, redirect to login
    const loginUrl = new URL('/auth/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('xheton_auth_token');
    return response;
  }

  // User is authenticated - check if accessing protected routes
  const isProtectedRoute = PROTECTED_ROUTES_PREFIXES.some(prefix => 
    pathname.startsWith(prefix)
  );

  if (isProtectedRoute) {
    // For protected routes, we rely on the check-status endpoint
    // The client side will handle the redirect based on subscription status
    // This middleware just ensures they're authenticated
    return NextResponse.next();
  }

  // If authenticated user tries to access auth pages, redirect to check-status
  if (pathname.startsWith('/auth/') && pathname !== '/auth/check-status') {
    return NextResponse.redirect(new URL('/auth/check-status', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
