import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { stabilityIssueFiltersSchema, stabilityIssueSortSchema } from '@/types/apis/dashboard';

import {
	getAnalyticsDashboardOptions,
	getStabilityDashboardOptions,
	getUserDashboardOptions,
} from '@/hooks/apis/dashboard';

import { getQueryClient } from '@/lib/query-client';

import Analytics from '@/app/(main)/(backoffice)/analytics/_components/analytics';
import { addDays, formatToday, getNow } from '@/utils/date';
import { toDashboardParams, toDashboardPeriod } from '@/utils/search-params';

/** 분석 페이지 */
export default async function Page(props: PageProps<'/analytics'>) {
	const searchParams = await props.searchParams;
	const today = formatToday();

	const period = toDashboardPeriod(searchParams.period);
	// 직접 고른 날짜가 없으면 기간 버튼의 일수로 조회
	const customDashboardParams = toDashboardParams(searchParams.date_from, searchParams.date_to);
	const dashboardParams = customDashboardParams ?? { date_from: addDays(today, 1 - period), date_to: today };

	const sort = stabilityIssueSortSchema.safeParse(searchParams.sort).data ?? 'date';
	const parsedFilters = stabilityIssueFiltersSchema.parse(searchParams);
	// 릴리스는 프로젝트를 선택한 경우에만 조회
	const issueFilters = { ...parsedFilters, release: parsedFilters.project ? parsedFilters.release : undefined };

	// 링크가 유지할 현재 주소의 쿼리
	const listQuery = { sort: sort === 'date' ? undefined : sort, ...issueFilters };
	const query = { ...(customDashboardParams ?? { period }), ...listQuery };

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(getUserDashboardOptions(dashboardParams));
	void queryClient.prefetchQuery(getStabilityDashboardOptions({ dashboardParams, sort, issueFilters }));
	void queryClient.prefetchQuery(getAnalyticsDashboardOptions(dashboardParams));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Analytics
				period={customDashboardParams ? undefined : period}
				dashboardParams={dashboardParams}
				sort={sort}
				issueFilters={issueFilters}
				listQuery={listQuery}
				query={query}
				today={today}
				now={getNow()}
			/>
		</HydrationBoundary>
	);
}
