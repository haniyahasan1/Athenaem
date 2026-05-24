import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const access = req.cookies.get('site_access')?.value;
  if (access !== 'granted') {
    return NextResponse.redirect(new URL('/gate', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!gate|read|api|_next|favicon.ico).*)'],
};
