import type { PresetLanguage } from '@/types/apis/preset-words';

const localeNames: Record<string, string> = { 'ko-KR': '한국어', 'en-US': 'English' };
const presetLanguageNames: Record<PresetLanguage, string> = { ko: '한국어', en: '영어' };

/** 언어 값을 화면에 표시할 이름으로 변환하는 함수 */
export const toLocaleName = (locale: string) => {
	return localeNames[locale] ?? locale;
};

/** 프리셋 언어를 화면에 표시할 이름으로 변환하는 함수 */
export const toPresetLanguageName = (language: PresetLanguage) => {
	return presetLanguageNames[language];
};
