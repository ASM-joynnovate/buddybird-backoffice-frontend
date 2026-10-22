import type { I18nText } from '@/types/apis/common';
import type { SendableNotificationKind } from '@/types/apis/notifications';
import type { UserListItem } from '@/types/apis/users';

import type { I18nFieldValue } from '@/types/i18n';

import { MARKETING_PREFIXES } from '@/config/notification';
import { toI18nFieldValue, toI18nText } from '@/utils/i18n-text';

/** 사용자가 이 종류의 알림을 받는지 확인하는 함수 */
export const receivesNotification = (user: UserListItem, kind: SendableNotificationKind) => {
	if (kind === 'announcement') {
		return user.is_announcement_enabled;
	}

	return kind === 'urgent' || user.is_marketing_enabled;
};

/** 입력값을 마케팅이면 언어별 머리말을 붙인 발송 문구로 변환하는 함수 */
export const toSentText = (fieldValue: I18nFieldValue, kind: SendableNotificationKind): I18nText => {
	const text = toI18nText(fieldValue);

	if (kind !== 'marketing') {
		return text;
	}

	return {
		ko_kr: text.ko_kr && `${MARKETING_PREFIXES.ko_kr}${text.ko_kr}`,
		en_us: text.en_us && `${MARKETING_PREFIXES.en_us}${text.en_us}`,
		ja_jp: text.ja_jp && `${MARKETING_PREFIXES.ja_jp}${text.ja_jp}`,
		ru_ru: text.ru_ru && `${MARKETING_PREFIXES.ru_ru}${text.ru_ru}`,
		es_es: text.es_es && `${MARKETING_PREFIXES.es_es}${text.es_es}`,
		zh_cn: text.zh_cn && `${MARKETING_PREFIXES.zh_cn}${text.zh_cn}`,
		zh_tw: text.zh_tw && `${MARKETING_PREFIXES.zh_tw}${text.zh_tw}`,
	};
};

/** 저장된 문구 앞의 머리말을 빼는 함수 */
const removeMarketingPrefix = (text: string, locale: keyof I18nFieldValue) => {
	return text.startsWith(MARKETING_PREFIXES[locale]) ? text.slice(MARKETING_PREFIXES[locale].length) : text;
};

/** 보낸 알림을 다시 보낼 입력값으로 변환하는 함수 */
export const toCopiedContent = (notification: {
	kind: SendableNotificationKind;
	title: I18nText;
	body: I18nText;
	image: { url: string } | null;
	image_file_id: string | null;
}) => {
	// 마케팅 문구는 발송할 때 머리말이 다시 붙음
	const toFieldValue = (text: I18nText) =>
		toI18nFieldValue(
			notification.kind === 'marketing'
				? {
						ko_kr: text.ko_kr && removeMarketingPrefix(text.ko_kr, 'ko_kr'),
						en_us: removeMarketingPrefix(text.en_us, 'en_us'),
						ja_jp: text.ja_jp && removeMarketingPrefix(text.ja_jp, 'ja_jp'),
						ru_ru: text.ru_ru && removeMarketingPrefix(text.ru_ru, 'ru_ru'),
						es_es: text.es_es && removeMarketingPrefix(text.es_es, 'es_es'),
						zh_cn: text.zh_cn && removeMarketingPrefix(text.zh_cn, 'zh_cn'),
						zh_tw: text.zh_tw && removeMarketingPrefix(text.zh_tw, 'zh_tw'),
					}
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
