import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getAbuseReportListOptions } from '@/hooks/apis/abuse-reports';
import { getDashboardLiveOptions } from '@/hooks/apis/dashboard';

import { getQueryClient } from '@/lib/query-client';

import AbuseReports from '@/app/(main)/(backoffice)/abuse-reports/_components/abuse-reports';
import { getNow } from '@/utils/date';
import { toPageNumber } from '@/utils/search-params';

/** 신고 목록 페이지 */
export default async function Page(props: PageProps<'/abuse-reports'>) {
	const searchParams = await props.searchParams;

	const handled = searchParams.handled === 'true';
	const listParams = { page: toPageNumber(searchParams.page), is_handled: handled };

	// 링크가 유지할 현재 주소의 쿼리
	const query = { handled: handled || undefined };

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(getDashboardLiveOptions());
	void queryClient.prefetchQuery(getAbuseReportListOptions(listParams));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AbuseReports listParams={listParams} query={query} now={getNow()} />
		</HydrationBoundary>
	);
}
