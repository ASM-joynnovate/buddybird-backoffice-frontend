import { NextRequest, NextResponse } from 'next/server';

import { BACKOFFICE_COOKIE_NAME } from '@/lib/auth';

const PUBLIC_PATHS = ['/login'];

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const isPublic = PUBLIC_PATHS.some((path) => pathname === path);

	const password = request.cookies.get(BACKOFFICE_COOKIE_NAME)?.value;

	if (!password && !isPublic) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (password && pathname === '/login') {
		return NextResponse.redirect(new URL('/captures', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
