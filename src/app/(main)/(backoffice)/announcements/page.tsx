import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { announcementSortSchema } from '@/types/apis/announcements';
import { sortOrderSchema } from '@/types/apis/common';

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

	const sort = announcementSortSchema.safeParse(searchParams.sort).data ?? 'starts_at';
	const order = sortOrderSchema.safeParse(searchParams.order).data ?? 'desc';
	const endedListParams = { page: toPageNumber(searchParams.page), is_ended: true, sort, order };

	// 링크가 유지할 현재 주소의 쿼리
	const query = {
		sort: sort === 'starts_at' ? undefined : sort,
		order: order === 'desc' ? undefined : order,
	};

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(getAnnouncementListOptions(activeListParams));
	void queryClient.prefetchQuery(getAnnouncementListOptions(endedListParams));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Announcements
				activeListParams={activeListParams}
				endedListParams={endedListParams}
				query={query}
				now={getNow()}
			/>
		</HydrationBoundary>
	);
}
