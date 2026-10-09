import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getFeedbackListOptions } from '@/hooks/apis/feedback';
import { getNotificationListOptions } from '@/hooks/apis/notifications';
import {
	getUserConsentListOptions,
	getUserOptions,
	getUserSessionListOptions,
	getUserWordListOptions,
} from '@/hooks/apis/users';

import { getQueryClient } from '@/lib/query-client';

import UserDetail from '@/app/(main)/(backoffice)/users/[id]/_components/user-detail';
import { USER_RECENT_ITEM_COUNT } from '@/config';
import { formatToday, getNow } from '@/utils/date';
import { toPageNumber } from '@/utils/search-params';

/** 사용자 상세 페이지 */
export default async function Page(props: PageProps<'/users/[id]'>) {
	const { id } = await props.params;
	const searchParams = await props.searchParams;
	const sessionPage = toPageNumber(searchParams.session_page);
	const recentListParams = { page: 1, count_by_page: USER_RECENT_ITEM_COUNT, user_id: id };

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(getUserOptions({ id }));
	void queryClient.prefetchQuery(getUserSessionListOptions({ id, page: 1 }));
	void queryClient.prefetchQuery(getNotificationListOptions(recentListParams));
	void queryClient.prefetchQuery(getFeedbackListOptions(recentListParams));
	void queryClient.prefetchQuery(getUserWordListOptions({ id }));
	void queryClient.prefetchQuery(getUserConsentListOptions({ id }));

	// 세션 목록은 첫 세션의 타임라인 조회에도 사용, 실패는 세션 카드가 표시
	const sessionList = queryClient
		.fetchQuery(getUserSessionListOptions({ id, page: sessionPage }))
		.catch(() => undefined);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<UserDetail
				id={id}
				sessionPage={sessionPage}
				sessionList={sessionList}
				today={formatToday()}
				now={getNow()}
			/>
		</HydrationBoundary>
	);
}
