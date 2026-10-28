import { LOCALE_NAMES } from '@/config/locale';

/** 언어 값을 화면에 표시할 이름으로 변환하는 함수 */
export const toLocaleName = (locale: string) => {
	return LOCALE_NAMES[locale] ?? locale;
};
