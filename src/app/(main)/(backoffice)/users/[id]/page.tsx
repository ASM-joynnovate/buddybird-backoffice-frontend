import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { uuidSchema } from '@/types/apis/primitives';
import { correctnessSchema } from '@/types/apis/sessions';

import { getFeedbackListOptions } from '@/hooks/apis/feedback';
import { getNotificationListOptions } from '@/hooks/apis/notifications';
import {
	getUserConsentListOptions,
	getUserNotificationSettingsOptions,
	getUserOptions,
	getUserSessionListOptions,
	getUserWordListOptions,
} from '@/hooks/apis/users';

import { getQueryClient } from '@/lib/query-client';

import UserDetail from '@/app/(main)/(backoffice)/users/[id]/_components/user-detail';
import { USER_RECENT_ITEM_COUNT } from '@/config';
import { DEFAULT_LABELS, SOUND_KIND_FILTER_GROUP, SOUND_KIND_FILTER_KINDS } from '@/config/session-filters';
import { formatToday, getNow } from '@/utils/date';
import { toLabels, toPageNumber } from '@/utils/search-params';

/** 사용자 상세 페이지 */
export default async function Page(props: PageProps<'/users/[id]'>) {
	const { id } = await props.params;
	const searchParams = await props.searchParams;
	const sessionPage = toPageNumber(searchParams.session_page);
	// 처음에 선택할 세션
	const sessionId = uuidSchema.safeParse(searchParams.session_id).data;
	const recentListParams = { page: 1, count_by_page: USER_RECENT_ITEM_COUNT, user_id: id };

	const labels = toLabels(searchParams.label);
	const soundKind = SOUND_KIND_FILTER_GROUP.options.find(
		(filterOption) => filterOption.value === searchParams.sound_kind,
	)?.value;
	const soundReview = correctnessSchema.safeParse(searchParams.sound_review).data;

	const label = labels ?? DEFAULT_LABELS;
	const soundListParams = {
		kind: SOUND_KIND_FILTER_KINDS[soundKind ?? SOUND_KIND_FILTER_GROUP.defaultValue],
		user_review: soundReview && [soundReview],
	};
	// 링크가 유지할 세션 필터 쿼리
	const sessionQuery = { label: labels?.join(','), sound_kind: soundKind, sound_review: soundReview };

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(getUserOptions({ id }));
	void queryClient.prefetchQuery(getUserSessionListOptions({ id, page: 1 }));
	void queryClient.prefetchQuery(getNotificationListOptions(recentListParams));
	void queryClient.prefetchQuery(getFeedbackListOptions(recentListParams));
	void queryClient.prefetchQuery(getUserWordListOptions({ id }));
	void queryClient.prefetchQuery(getUserConsentListOptions({ id }));
	void queryClient.prefetchQuery(getUserNotificationSettingsOptions({ id }));

	// 세션 목록은 첫 세션의 타임라인 조회에도 사용
	// 실패 시 세션 카드에 오류 표시
	const sessionList = queryClient
		.fetchQuery(getUserSessionListOptions({ id, page: sessionPage, sessionId, label }))
		.catch(() => undefined);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<UserDetail
				id={id}
				sessionPage={sessionPage}
				sessionId={sessionId}
				sessionList={sessionList}
				label={label}
				soundListParams={soundListParams}
				sessionQuery={sessionQuery}
				today={formatToday()}
				now={getNow()}
			/>
		</HydrationBoundary>
	);
}
