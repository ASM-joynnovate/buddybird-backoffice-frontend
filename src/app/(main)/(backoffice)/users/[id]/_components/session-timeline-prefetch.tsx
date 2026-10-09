import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import type { CountedPage } from '@/types/apis/common';
import type { Session } from '@/types/apis/sessions';

import { getSessionEventListOptions, getSessionSoundListOptions } from '@/hooks/apis/sessions';

import { getQueryClient } from '@/lib/query-client';

interface Props {
	sessionList: Promise<CountedPage<Session> | undefined>;
}

/**
 * 세션 목록을 받은 뒤 처음 고르는 세션의 타임라인 조회를 시작하는 컴포넌트
 * @param sessionList 페이지에서 시작한 세션 목록 조회
 */
const SessionTimelinePrefetch = async ({ sessionList }: Props) => {
	// UserSessionCard는 목록의 첫 세션을 먼저 고름
	const firstSession = (await sessionList)?.data[0];

	if (!firstSession) {
		return null;
	}

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(getSessionEventListOptions({ id: firstSession.id }));
	void queryClient.prefetchQuery(getSessionSoundListOptions({ id: firstSession.id }));

	return <HydrationBoundary state={dehydrate(queryClient)} />;
};

export default SessionTimelinePrefetch;
