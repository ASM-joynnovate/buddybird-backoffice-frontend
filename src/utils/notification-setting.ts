import type { I18nText } from '@/types/apis/common';
import type { UpdateNotificationSettingGroupRequest } from '@/types/apis/notification-settings';

import type { I18nFieldValue } from '@/types/i18n';

import { englishTextMissing, toChangedI18nText, toI18nText, toOptionalI18nText } from '@/utils/i18n-text';

/** 저장할 수 없는 제목 및 설명의 안내 문구를 반환하는 함수 */
export const toNotificationSettingTextError = (title: I18nFieldValue, description: I18nFieldValue) => {
	if (!title.en_us.trim()) {
		return '영어 제목을 입력해 주세요.';
	}

	return englishTextMissing(description) ? '영어 설명을 입력해 주세요.' : '';
};

/** 바뀐 문구만 담은 수정 요청을 반환하는 함수 */
export const toNotificationSettingTextUpdate = (
	title: I18nFieldValue,
	description: I18nFieldValue,
	saved: { title: I18nText; description: I18nText | null },
): UpdateNotificationSettingGroupRequest => {
	const changedTitle = toChangedI18nText(toI18nText(title), saved.title);
	const descriptionText = toOptionalI18nText(description);
	const descriptionChanged = descriptionText
		? Object.keys(toChangedI18nText(descriptionText, saved.description)).length > 0
		: !!saved.description;

	return {
		...(Object.keys(changedTitle).length > 0 && { title: changedTitle }),
		...(descriptionChanged && { description: descriptionText }),
	};
};
