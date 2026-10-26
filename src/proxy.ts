import { type NextRequest, NextResponse } from 'next/server';

import { OPERATOR_NAME_COOKIE_NAME, PASSWORD_COOKIE_NAME } from '@/lib/auth';

const LOGIN_PATH = '/login';

/** 로그인 확인 proxy */
export const proxy = (request: NextRequest) => {
	const { pathname } = request.nextUrl;

	// 라벨에 저장할 운영자 이름이 없으면 다시 로그인
	const loginSaved =
		!!request.cookies.get(PASSWORD_COOKIE_NAME)?.value && !!request.cookies.get(OPERATOR_NAME_COOKIE_NAME)?.value;

	if (!loginSaved && pathname !== LOGIN_PATH) {
		return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
	}

	if (loginSaved && pathname === LOGIN_PATH) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
};

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
