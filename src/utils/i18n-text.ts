import type { I18nText } from '@/types/apis/common';

import type { I18nFieldValue } from '@/types/i18n';

/** 한국어 문구가 없으면 영어 문구를 반환하는 함수 */
export const koreanOrEnglishText = (text: I18nText) => {
	return text.ko_kr ?? text.en_us;
};

/** 서버의 다국어 문구를 입력값으로 변환하는 함수 */
export const toI18nFieldValue = (text: I18nText | null) => {
	return { ko_kr: text?.ko_kr ?? '', en_us: text?.en_us ?? '' };
};

/** 입력값을 서버에 보낼 다국어 문구로 변환하는 함수 */
export const toI18nText = (fieldValue: I18nFieldValue) => {
	return { ko_kr: fieldValue.ko_kr.trim() || null, en_us: fieldValue.en_us.trim() };
};

/** 선택 입력값을 서버에 보낼 다국어 문구로 변환하는 함수 */
export const toOptionalI18nText = (fieldValue: I18nFieldValue) => {
	return fieldValue.en_us.trim() ? toI18nText(fieldValue) : null;
};

/** 영어 문구 없이 한국어 문구만 입력했는지 확인하는 함수 */
export const englishTextMissing = (fieldValue: I18nFieldValue) => {
	return !!fieldValue.ko_kr.trim() && !fieldValue.en_us.trim();
};
