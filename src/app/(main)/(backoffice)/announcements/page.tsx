import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getAnnouncementListOptions } from '@/hooks/apis/announcements';

import { getQueryClient } from '@/lib/query-client';

import Announcements from '@/app/(main)/(backoffice)/announcements/_components/announcements';
import { getNow } from '@/utils/date';
import { toPageNumber } from '@/utils/search-params';

/** 공지 페이지 */
export default async function Page(props: PageProps<'/announcements'>) {
	const searchParams = await props.searchParams;

	// 게시 중이거나 예약된 공지는 한 번에 조회
	const activeListParams = { page: 1, count_by_page: 100, is_ended: false };
	const endedListParams = { page: toPageNumber(searchParams.page), is_ended: true };

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(getAnnouncementListOptions(activeListParams));
	void queryClient.prefetchQuery(getAnnouncementListOptions(endedListParams));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Announcements activeListParams={activeListParams} endedListParams={endedListParams} now={getNow()} />
		</HydrationBoundary>
	);
}
