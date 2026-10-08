import type { Consent } from '@/types/apis/consents';

import dayjs from 'dayjs';

export type ConsentStatus = 'live' | 'scheduled' | 'past';

/** 게시 일시가 아직 오지 않았는지 확인하는 함수 */
export const isScheduled = (consent: Consent, now: number) => {
	return dayjs(consent.published_at).isAfter(now);
};

/** 같은 종류에서 게시 중인 버전을 찾는 함수 */
export const findLiveConsent = (kindConsents: Consent[], now: number) => {
	// 목록은 버전 내림차순
	return kindConsents.find((consent) => !isScheduled(consent, now));
};

/** 버전의 게시 상태를 반환하는 함수 */
export const toConsentStatus = (consent: Consent, liveConsent: Consent | undefined, now: number): ConsentStatus => {
	if (isScheduled(consent, now)) {
		return 'scheduled';
	}

	return consent.id === liveConsent?.id ? 'live' : 'past';
};

/** 게시되면 사용자에게 일어나는 일을 반환하는 함수 */
export const toPublishNotice = (required: boolean, liveConsentExists: boolean) => {
	if (required) {
		return liveConsentExists
			? '게시되면 모든 사용자가 다음에 앱을 열 때 다시 동의해야 합니다.'
			: '게시되면 모든 사용자가 다음에 앱을 열 때 동의해야 합니다.';
	}

	return liveConsentExists
		? '게시되면 이전 버전에 동의한 사용자도 앱에서 동의하지 않은 상태로 표시됩니다.'
		: '게시되면 앱의 약관 동의 화면에 선택 항목으로 표시됩니다.';
};
