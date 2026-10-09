import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getDashboardLiveOptions, getDashboardOptions } from '@/hooks/apis/dashboard';
import { getFeedbackListOptions } from '@/hooks/apis/feedback';

import { getQueryClient } from '@/lib/query-client';

import Home from '@/app/(main)/(backoffice)/(home)/_components/home';
import { addDays, formatToday, getNow } from '@/utils/date';
import { toDashboardParams, toDashboardPeriod } from '@/utils/search-params';

/** 홈 페이지 */
export default async function Page(props: PageProps<'/'>) {
	const searchParams = await props.searchParams;
	const today = formatToday();
	const period = toDashboardPeriod(searchParams.period);
	// 직접 고른 날짜가 없으면 기간 버튼의 일수로 조회
	const customDashboardParams = toDashboardParams(searchParams.date_from, searchParams.date_to);
	const dashboardParams = customDashboardParams ?? { date_from: addDays(today, 1 - period), date_to: today };

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(getDashboardLiveOptions());
	void queryClient.prefetchQuery(getDashboardOptions(dashboardParams));
	void queryClient.prefetchQuery(getFeedbackListOptions({ page: 1 }));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Home
				period={customDashboardParams ? undefined : period}
				dashboardParams={dashboardParams}
				today={today}
				now={getNow()}
			/>
		</HydrationBoundary>
	);
}
