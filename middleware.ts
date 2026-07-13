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

// Tutor protected routes (require tutor authentication)
const tutorRoutes = ['/tutor'];

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

const ADMIN_ROLES = ['SUPER_ADMIN', 'SUB_ADMIN'];

/**
 * Reads the role from the auth_session cookie. Returns null for legacy/presence
 * cookies ("1") so callers can fall back to authentication-only checks instead
 * of locking out sessions created before role was stored.
 */
function getSessionRole(authSession?: string): string | null {
  if (!authSession || authSession === '1') return null;
  return authSession;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check for auth: refresh_token (set by backend, same-origin only) or auth_session (set by frontend after login when API is on another origin, e.g. Render)
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const authSession = request.cookies.get('auth_session')?.value;
  const isAuthenticated = !!refreshToken || !!authSession;
  const role = getSessionRole(authSession);

  const redirectToSignin = (signinPath: string) => {
    const url = new URL(signinPath, request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  };

  // Wrong-role access → send to the unauthorized page (only enforced when the
  // role is known; legacy cookies fall through to auth-only behavior).
  const unauthorized = () =>
    NextResponse.redirect(new URL('/unauthorized', request.url));

  // Handle student routes and course payment routes
  if (
    isStudentRoute(pathname) ||
    (pathname.includes('/courses/') && pathname.includes('/payment'))
  ) {
    if (!isAuthenticated) return redirectToSignin('/signin');
    if (role && role !== 'STUDENT') return unauthorized();
    return NextResponse.next();
  }

  // Handle tutor routes
  if (tutorRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) return redirectToSignin('/signin');
    if (role && role !== 'TUTOR') return unauthorized();
    return NextResponse.next();
  }

  // Handle admin routes (excluding /admin/signin which is public)
  if (isAdminRoute(pathname)) {
    if (!isAuthenticated) return redirectToSignin('/admin/signin');
    if (role && !ADMIN_ROLES.includes(role)) return unauthorized();
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
