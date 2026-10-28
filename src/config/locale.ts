import type { I18nFieldValue } from '@/types/i18n';

export const I18N_LOCALES = [
	{ locale: 'ko_kr', label: '한국어' },
	{ locale: 'en_us', label: '영어' },
	{ locale: 'ja_jp', label: '일본어' },
	{ locale: 'ru_ru', label: '러시아어' },
	{ locale: 'es_es', label: '스페인어' },
	{ locale: 'th_th', label: '태국어' },
	{ locale: 'zh_hans', label: '중국어(간체)' },
	{ locale: 'zh_hant', label: '중국어(번체)' },
	{ locale: 'vi_vn', label: '베트남어' },
	{ locale: 'hi_in', label: '힌디어' },
	{ locale: 'bn_bd', label: '벵골어' },
] satisfies { locale: keyof I18nFieldValue; label: string }[];

// 앱이 기기 등록 때 전송하는 언어
export const LOCALE_NAMES: Record<string, string> = {
	'ko-KR': '한국어',
	'en-US': 'English',
	'ja-JP': '日本語',
	'ru-RU': 'Русский',
	'es-ES': 'Español',
	'th-TH': 'ไทย',
	'zh-Hans': '简体中文',
	'zh-Hant': '繁體中文',
	'vi-VN': 'Tiếng Việt',
	'hi-IN': 'हिन्दी',
	'bn-BD': 'বাংলা',
};
