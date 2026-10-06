import { type NextRequest, NextResponse } from 'next/server';

import { PASSWORD_COOKIE_NAME } from '@/lib/auth';

const LOGIN_PATH = '/login';

/** 비밀번호 쿠키가 없으면 로그인 화면으로 보내는 proxy */
export const proxy = (request: NextRequest) => {
	const { pathname } = request.nextUrl;

	const passwordSaved = !!request.cookies.get(PASSWORD_COOKIE_NAME)?.value;

	if (!passwordSaved && pathname !== LOGIN_PATH) {
		return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
	}

	if (passwordSaved && pathname === LOGIN_PATH) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
};

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
