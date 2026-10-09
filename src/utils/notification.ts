import type { I18nText } from '@/types/apis/common';
import type { SendableNotificationKind } from '@/types/apis/notifications';
import type { UserListItem } from '@/types/apis/users';

import type { I18nFieldValue } from '@/types/i18n';

import { MARKETING_PREFIX } from '@/config/notification';
import { toI18nFieldValue, toI18nText } from '@/utils/i18n-text';

/** 사용자가 이 종류의 알림을 받는지 확인하는 함수 */
export const receivesNotification = (user: UserListItem, kind: SendableNotificationKind) => {
	if (kind === 'announcement') {
		return user.is_announcement_enabled;
	}

	return kind === 'urgent' || user.is_marketing_enabled;
};

/** 입력값을 마케팅이면 "(광고) "를 붙인 발송 문구로 변환하는 함수 */
export const toSentText = (fieldValue: I18nFieldValue, kind: SendableNotificationKind) => {
	const text = toI18nText(fieldValue);
	const prefix = kind === 'marketing' ? MARKETING_PREFIX : '';

	return { ko_kr: text.ko_kr && `${prefix}${text.ko_kr}`, en_us: text.en_us && `${prefix}${text.en_us}` };
};

/** 저장된 문구 앞의 "(광고) "를 빼는 함수 */
const removeMarketingPrefix = (text: string) => {
	return text.startsWith(MARKETING_PREFIX) ? text.slice(MARKETING_PREFIX.length) : text;
};

/** 보낸 알림을 다시 보낼 입력값으로 변환하는 함수 */
export const toCopiedContent = (notification: {
	kind: SendableNotificationKind;
	title: I18nText;
	body: I18nText;
	image: { url: string } | null;
	image_file_id: string | null;
}) => {
	// 마케팅 문구는 발송할 때 "(광고) "가 다시 붙음
	const toFieldValue = (text: I18nText) =>
		toI18nFieldValue(
			notification.kind === 'marketing'
				? { ko_kr: text.ko_kr && removeMarketingPrefix(text.ko_kr), en_us: removeMarketingPrefix(text.en_us) }
				: text,
		);

	return {
		kind: notification.kind,
		title: toFieldValue(notification.title),
		body: toFieldValue(notification.body),
		imageFileId: notification.image_file_id,
		imageFile: null,
		imagePreviewUrl: notification.image?.url ?? null,
	};
};
