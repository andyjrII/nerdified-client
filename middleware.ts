import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/signin',
  '/signup',
  '/courses',
  '/blog',
  '/about',
  '/contact',
  '/admin/signin',
  '/unauthorized',
];

// Student protected routes (require student authentication)
const studentRoutes = ['/student'];

// Admin protected routes (require admin authentication)
// Note: /admin/signin is public, so it's handled separately
const adminRoutes = ['/admin', '/admins'];

// Helper function to check if path matches a route pattern
function isPublicRoute(pathname: string): boolean {
  // Exact match for public routes
  if (publicRoutes.includes(pathname)) return true;
  
  // Handle dynamic routes like /courses/[id] (public - can view course details)
  // But /courses/[id]/payment requires authentication
  if (pathname.startsWith('/courses/') && !pathname.includes('/payment')) {
    return true;
  }
  
  // Handle /blog routes (public)
  if (pathname.startsWith('/blog')) return true;
  
  return false;
}

function isStudentRoute(pathname: string): boolean {
  return studentRoutes.some((route) => pathname.startsWith(route));
}

function isAdminRoute(pathname: string): boolean {
  // Exclude /admin/signin from admin routes
  if (pathname === '/admin/signin') return false;
  return adminRoutes.some((route) => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for refresh_token cookie (set by backend as httpOnly cookie)
  // The backend sets this cookie on signin for both student and admin
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // Handle student routes and course payment routes
  if (isStudentRoute(pathname) || pathname.includes('/courses/') && pathname.includes('/payment')) {
    if (!refreshToken) {
      // Redirect to signin if not authenticated
      const signinUrl = new URL('/signin', request.url);
      signinUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(signinUrl);
    }
    return NextResponse.next();
  }

  // Handle admin routes (excluding /admin/signin which is public)
  if (isAdminRoute(pathname)) {
    if (!refreshToken) {
      // Redirect to admin signin if not authenticated
      const adminSigninUrl = new URL('/admin/signin', request.url);
      adminSigninUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(adminSigninUrl);
    }
    return NextResponse.next();
  }

  // Allow all other routes (fallback)
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
