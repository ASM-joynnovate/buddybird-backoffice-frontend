import { PASSWORD_COOKIE_MAX_AGE_MS } from '@/config';
import { SECOND } from '@/config/units';

export const PASSWORD_COOKIE_NAME = 'backoffice-password';
export const OPERATOR_NAME_COOKIE_NAME = 'backoffice-operator-name';
export const PASSWORD_HEADER_NAME = 'X-Backoffice-Password';

/** 브라우저 쿠키 값을 읽는 함수 */
const readBrowserCookie = (name: string) => {
	const cookie = document.cookie.split('; ').find((item) => item.startsWith(`${name}=`));

	return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : undefined;
};

/** 브라우저 쿠키에서 비밀번호를 읽는 함수 */
export const readBrowserPassword = () => {
	return readBrowserCookie(PASSWORD_COOKIE_NAME);
};

/** 브라우저 쿠키에서 운영자 이름을 읽는 함수 */
export const readBrowserOperatorName = () => {
	return readBrowserCookie(OPERATOR_NAME_COOKIE_NAME) ?? '';
};

/** 비밀번호 및 운영자 이름을 브라우저 쿠키에 저장하는 함수 */
export const saveLogin = ({ password, operatorName }: { password: string; operatorName: string }) => {
	const maxAge = PASSWORD_COOKIE_MAX_AGE_MS / SECOND;

	document.cookie = `${PASSWORD_COOKIE_NAME}=${encodeURIComponent(password)}; path=/; max-age=${maxAge}; SameSite=Lax`;
	document.cookie = `${OPERATOR_NAME_COOKIE_NAME}=${encodeURIComponent(operatorName)}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

/** 브라우저 쿠키의 비밀번호 및 운영자 이름을 삭제하는 함수 */
export const removeLogin = () => {
	document.cookie = `${PASSWORD_COOKIE_NAME}=; path=/; max-age=0`;
	document.cookie = `${OPERATOR_NAME_COOKIE_NAME}=; path=/; max-age=0`;
};

/** 로그아웃 함수 */
export const signOut = () => {
	removeLogin();

	window.location.replace('/login');
};
