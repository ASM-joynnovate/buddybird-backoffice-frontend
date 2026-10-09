import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import type { Consent } from '@/types/apis/consents';

import { getConsentDashboardOptions } from '@/hooks/apis/dashboard';

import { getQueryClient } from '@/lib/query-client';

import { DEFAULT_DASHBOARD_PERIOD } from '@/config';
import { findLiveConsent } from '@/utils/consent';
import { addDays } from '@/utils/date';

interface Props {
	consentList: Promise<Consent[] | undefined>;
	kind?: string;
	version?: string;
	today: string;
	now: number;
}

/**
 * 고지문 목록을 받은 뒤 처음 보여 줄 버전의 통계 조회를 시작하는 컴포넌트
 * @param consentList 페이지에서 시작한 고지문 목록 조회
 * @param kind 주소에서 고른 종류
 * @param version 주소에서 고른 버전
 * @param today 오늘 날짜
 * @param now 서버가 화면을 그린 시각
 */
const ConsentStatsPrefetch = async ({ consentList, kind, version, today, now }: Props) => {
	const consents = (await consentList) ?? [];

	// ConsentCards 및 ConsentDetailCard가 처음 고르는 종류와 버전
	const selectedKind = consents.some((consent) => consent.kind === kind) ? kind : consents[0]?.kind;
	const kindConsents = consents.filter((consent) => consent.kind === selectedKind);
	const liveConsent = findLiveConsent(kindConsents, now);
	const selectedConsent = kindConsents.find((consent) => String(consent.version) === version) ?? liveConsent;

	// 통계는 게시 중인 버전에만 표시
	if (!liveConsent || selectedConsent?.id !== liveConsent.id) {
		return null;
	}

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(
		getConsentDashboardOptions({
			id: liveConsent.id,
			dashboardParams: { date_from: addDays(today, 1 - DEFAULT_DASHBOARD_PERIOD), date_to: today },
		}),
	);

	return <HydrationBoundary state={dehydrate(queryClient)} />;
};

export default ConsentStatsPrefetch;
