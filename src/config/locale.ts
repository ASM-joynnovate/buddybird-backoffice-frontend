import type { I18nFieldValue } from '@/types/i18n';

export const I18N_LOCALES = [
	{ locale: 'ko_kr', label: '한국어' },
	{ locale: 'en_us', label: '영어' },
	{ locale: 'ja_jp', label: '일본어' },
	{ locale: 'ru_ru', label: '러시아어' },
	{ locale: 'es_es', label: '스페인어' },
	{ locale: 'th_th', label: '태국어' },
] satisfies { locale: keyof I18nFieldValue; label: string }[];

// 앱이 기기 등록 때 보내는 언어
export const LOCALE_NAMES: Record<string, string> = {
	'ko-KR': '한국어',
	'en-US': 'English',
	'ja-JP': '日本語',
	'ru-RU': 'Русский',
	'es-ES': 'Español',
	'th-TH': 'ไทย',
};
