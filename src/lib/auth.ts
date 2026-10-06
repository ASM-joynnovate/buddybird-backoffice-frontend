import { PASSWORD_COOKIE_MAX_AGE_MS } from '@/config';
import { SECOND } from '@/config/units';

export const PASSWORD_COOKIE_NAME = 'backoffice-password';
export const PASSWORD_HEADER_NAME = 'X-Backoffice-Password';

/** 브라우저 쿠키에서 비밀번호를 읽는 함수 */
export const readBrowserPassword = () => {
	const passwordCookie = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${PASSWORD_COOKIE_NAME}=`));

	return passwordCookie ? decodeURIComponent(passwordCookie.slice(PASSWORD_COOKIE_NAME.length + 1)) : undefined;
};

/** 비밀번호를 브라우저 쿠키에 저장하는 함수 */
export const savePassword = (password: string) => {
	const maxAge = PASSWORD_COOKIE_MAX_AGE_MS / SECOND;

	document.cookie = `${PASSWORD_COOKIE_NAME}=${encodeURIComponent(password)}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

/** 브라우저 쿠키의 비밀번호를 삭제하는 함수 */
export const removePassword = () => {
	document.cookie = `${PASSWORD_COOKIE_NAME}=; path=/; max-age=0`;
};

/** 로그아웃 함수 */
export const signOut = () => {
	removePassword();

	window.location.replace('/login');
};
