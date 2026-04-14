// src/proxy.ts
import { NextResponse } from 'next/server';
import { decrypt } from './lib/session';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route),
  );

  const cookie = (await cookies()).get('session')?.value;
  
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
