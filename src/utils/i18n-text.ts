import type { I18nText } from '@/types/apis/common';

import type { I18nFieldValue } from '@/types/i18n';

import { I18N_LOCALES } from '@/config/locale';

/** 한국어 문구가 없으면 영어 문구를 반환하는 함수 */
export const koreanOrEnglishText = (text: I18nText) => {
	return text.ko_kr ?? text.en_us;
};

/** 언어를 화면에 표시할 이름으로 변환하는 함수 */
export const toI18nLocaleName = (locale: keyof I18nFieldValue) => {
	return I18N_LOCALES.find((localeOption) => localeOption.locale === locale)?.label ?? locale;
};

/** 서버의 다국어 문구를 입력값으로 변환하는 함수 */
export const toI18nFieldValue = (text: I18nText | null): I18nFieldValue => {
	return {
		ko_kr: text?.ko_kr ?? '',
		en_us: text?.en_us ?? '',
		ja_jp: text?.ja_jp ?? '',
		ru_ru: text?.ru_ru ?? '',
		es_es: text?.es_es ?? '',
		zh_cn: text?.zh_cn ?? '',
		zh_tw: text?.zh_tw ?? '',
	};
};

/** 입력값을 서버에 보낼 다국어 문구로 변환하는 함수 */
export const toI18nText = (fieldValue: I18nFieldValue): I18nText => {
	return {
		ko_kr: fieldValue.ko_kr.trim() || null,
		en_us: fieldValue.en_us.trim(),
		ja_jp: fieldValue.ja_jp.trim() || null,
		ru_ru: fieldValue.ru_ru.trim() || null,
		es_es: fieldValue.es_es.trim() || null,
		zh_cn: fieldValue.zh_cn.trim() || null,
		zh_tw: fieldValue.zh_tw.trim() || null,
	};
};

/** 선택 입력값을 서버에 보낼 다국어 문구로 변환하는 함수 */
export const toOptionalI18nText = (fieldValue: I18nFieldValue) => {
	return fieldValue.en_us.trim() ? toI18nText(fieldValue) : null;
};

/** 서버 문구와 비교해 바뀐 언어의 문구만 반환하는 함수 */
export const toChangedI18nText = (text: I18nText, savedText: I18nText | null): Partial<I18nText> => {
	return Object.fromEntries(
		I18N_LOCALES.filter(({ locale }) => text[locale] !== (savedText?.[locale] ?? null)).map(({ locale }) => [
			locale,
			text[locale],
		]),
	);
};

/** 영어 문구 없이 다른 언어의 문구만 입력했는지 확인하는 함수 */
export const englishTextMissing = (fieldValue: I18nFieldValue) => {
	return !fieldValue.en_us.trim() && I18N_LOCALES.some(({ locale }) => !!fieldValue[locale].trim());
};
