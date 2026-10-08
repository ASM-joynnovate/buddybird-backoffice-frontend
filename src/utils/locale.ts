const localeNames: Record<string, string> = { 'ko-KR': '한국어', 'en-US': 'English' };

/** 언어 값을 화면에 표시할 이름으로 변환하는 함수 */
export const toLocaleName = (locale: string) => {
	return localeNames[locale] ?? locale;
};
