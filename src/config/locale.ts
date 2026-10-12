import type { I18nFieldValue } from '@/types/i18n';

export const I18N_LOCALES = [
	{ locale: 'ko_kr', label: '한국어' },
	{ locale: 'en_us', label: '영어' },
	{ locale: 'ja_jp', label: '일본어' },
	{ locale: 'ru_ru', label: '러시아어' },
	{ locale: 'es_es', label: '스페인어' },
] satisfies { locale: keyof I18nFieldValue; label: string }[];
