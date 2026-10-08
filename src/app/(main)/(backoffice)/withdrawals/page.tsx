import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getWithdrawalDashboardOptions } from '@/hooks/apis/dashboard';
import { getWithdrawalListOptions } from '@/hooks/apis/withdrawals';

import { getQueryClient } from '@/lib/query-client';

import Withdrawals from '@/app/(main)/(backoffice)/withdrawals/_components/withdrawals';
import { addDays, formatToday, getNow } from '@/utils/date';
import { toDashboardParams, toDashboardPeriod, toPageNumber } from '@/utils/search-params';

/** 탈퇴 페이지 */
export default async function Page(props: PageProps<'/withdrawals'>) {
	const searchParams = await props.searchParams;
	const today = formatToday();

	const period = toDashboardPeriod(searchParams.period);
	// 직접 고른 날짜가 없으면 기간 버튼의 일수로 조회
	const customDashboardParams = toDashboardParams(searchParams.date_from, searchParams.date_to);
	const dashboardParams = customDashboardParams ?? { date_from: addDays(today, 1 - period), date_to: today };

	// 완료되지 않은 탈퇴는 조회 기간과 관계없이 조회
	const incompleteListParams = { page: 1, count_by_page: 100, is_completed: false };
	const completedListParams = {
		page: toPageNumber(searchParams.page),
		is_completed: true,
		created_from: dashboardParams.date_from,
		created_to: dashboardParams.date_to,
	};

	// 링크가 유지할 현재 주소의 쿼리
	const query = customDashboardParams ?? { period };

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(getWithdrawalListOptions(incompleteListParams));
	void queryClient.prefetchQuery(getWithdrawalDashboardOptions(dashboardParams));
	void queryClient.prefetchQuery(getWithdrawalListOptions(completedListParams));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Withdrawals
				period={customDashboardParams ? undefined : period}
				dashboardParams={dashboardParams}
				incompleteListParams={incompleteListParams}
				completedListParams={completedListParams}
				query={query}
				today={today}
				now={getNow()}
			/>
		</HydrationBoundary>
	);
}
