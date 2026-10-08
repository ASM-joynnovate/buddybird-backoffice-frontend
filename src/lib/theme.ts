import { type Theme, themes } from '@/types/theme';

import { THEME_COOKIE_MAX_AGE_MS } from '@/config';
import { SECOND } from '@/config/units';

export const THEME_COOKIE_NAME = 'theme';

/** 쿠키 값을 화면 모드로 변환하는 함수 */
export const toTheme = (value: string | undefined) => {
	return themes.find((theme) => theme === value);
};

/** 화면 모드를 html class와 브라우저 쿠키에 저장하는 함수 */
export const saveTheme = (theme: Theme | undefined) => {
	document.documentElement.classList.remove(...themes);

	if (!theme) {
		document.cookie = `${THEME_COOKIE_NAME}=; path=/; max-age=0`;

		return;
	}

	const maxAge = THEME_COOKIE_MAX_AGE_MS / SECOND;

	document.documentElement.classList.add(theme);
	document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=${maxAge}; SameSite=Lax`;
};
