import type { I18nText } from '@/types/apis/common';
import type { SendableNotificationKind } from '@/types/apis/notifications';
import type { UserListItem } from '@/types/apis/users';

import type { I18nFieldValue } from '@/types/i18n';

import { MARKETING_PREFIXES } from '@/config/notification';
import { toI18nFieldValue, toI18nText } from '@/utils/i18n-text';

/** 사용자가 이 종류의 알림을 수신하는지 확인하는 함수 */
export const receivesNotification = (user: UserListItem, kind: SendableNotificationKind) => {
	if (kind === 'announcement') {
		return user.is_announcement_enabled;
	}

	return kind === 'urgent' || user.is_marketing_enabled;
};

/** 입력값을 발송 문구로 변환하는 함수 */
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
		th_th: text.th_th && `${MARKETING_PREFIXES.th_th}${text.th_th}`,
		zh_hans: text.zh_hans && `${MARKETING_PREFIXES.zh_hans}${text.zh_hans}`,
		zh_hant: text.zh_hant && `${MARKETING_PREFIXES.zh_hant}${text.zh_hant}`,
		vi_vn: text.vi_vn && `${MARKETING_PREFIXES.vi_vn}${text.vi_vn}`,
		hi_in: text.hi_in && `${MARKETING_PREFIXES.hi_in}${text.hi_in}`,
		bn_bd: text.bn_bd && `${MARKETING_PREFIXES.bn_bd}${text.bn_bd}`,
	};
};

/** 저장된 문구 앞의 prefix를 제거하는 함수 */
const removeMarketingPrefix = (text: string, locale: keyof I18nFieldValue) => {
	return text.startsWith(MARKETING_PREFIXES[locale]) ? text.slice(MARKETING_PREFIXES[locale].length) : text;
};

/** 발송한 알림을 재발송 입력값으로 변환하는 함수 */
export const toCopiedContent = (notification: {
	kind: SendableNotificationKind;
	title: I18nText;
	body: I18nText;
	image: { url: string } | null;
	image_file_id: string | null;
}) => {
	// 마케팅 문구는 발송할 때 prefix가 다시 추가됨
	const toFieldValue = (text: I18nText) =>
		toI18nFieldValue(
			notification.kind === 'marketing'
				? {
						ko_kr: text.ko_kr && removeMarketingPrefix(text.ko_kr, 'ko_kr'),
						en_us: removeMarketingPrefix(text.en_us, 'en_us'),
						ja_jp: text.ja_jp && removeMarketingPrefix(text.ja_jp, 'ja_jp'),
						ru_ru: text.ru_ru && removeMarketingPrefix(text.ru_ru, 'ru_ru'),
						es_es: text.es_es && removeMarketingPrefix(text.es_es, 'es_es'),
						th_th: text.th_th && removeMarketingPrefix(text.th_th, 'th_th'),
						zh_hans: text.zh_hans && removeMarketingPrefix(text.zh_hans, 'zh_hans'),
						zh_hant: text.zh_hant && removeMarketingPrefix(text.zh_hant, 'zh_hant'),
						vi_vn: text.vi_vn && removeMarketingPrefix(text.vi_vn, 'vi_vn'),
						hi_in: text.hi_in && removeMarketingPrefix(text.hi_in, 'hi_in'),
						bn_bd: text.bn_bd && removeMarketingPrefix(text.bn_bd, 'bn_bd'),
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
