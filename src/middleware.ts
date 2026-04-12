import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const appPassword = process.env.APP_PASSWORD;
  
  // Skip check if no password is set or if we are in development
  if (!appPassword || process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const cookie = request.cookies.get('auth_gate');
  const url = request.nextUrl.clone();

  // Simple gate: allow access if cookie matches app password or if it's the login action
  if (cookie?.value === appPassword) {
    return NextResponse.next();
  }

  // If user is trying to submit the password via query (simple workaround for basic gate)
  const queryPass = url.searchParams.get('pass');
  if (queryPass === appPassword) {
    const response = NextResponse.redirect(url.origin + url.pathname);
    response.cookies.set('auth_gate', appPassword, { httpOnly: true, secure: true });
    return response;
  }

  // Otherwise, return 401 Unauthorized or simple error message
  return new NextResponse('Unauthorized: Access Restricted. Append ?pass=YOUR_PASSWORD to the URL to access.', { status: 401 });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
