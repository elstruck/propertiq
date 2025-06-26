import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for a protected route (dashboard pages)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // For now, let's disable middleware redirect and handle auth in the dashboard component
    // The proper way would be to check Firebase auth state, but that requires server-side setup
    console.log('Dashboard access attempt - letting through for now');
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 