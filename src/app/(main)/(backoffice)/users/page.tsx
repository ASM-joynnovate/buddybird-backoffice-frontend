import { redirect } from 'next/navigation';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { sortOrderSchema } from '@/types/apis/common';
import { uuidSchema } from '@/types/apis/primitives';
import { userSortSchema } from '@/types/apis/users';

import { getUserDashboardOptions } from '@/hooks/apis/dashboard';
import { getUserListOptions } from '@/hooks/apis/users';

import { getQueryClient } from '@/lib/query-client';

import Users from '@/app/(main)/(backoffice)/users/_components/users';
import { addDays, formatToday, getNow } from '@/utils/date';
import {
	toDashboardParams,
	toDashboardPeriod,
	toOptionalText,
	toPageNumber,
	toUserFilterParams,
	toUserFilters,
} from '@/utils/search-params';

/** 사용자 목록 페이지 */
export default async function Page(props: PageProps<'/users'>) {
	const searchParams = await props.searchParams;
	const today = formatToday();
	const keyword = toOptionalText(searchParams.keyword);

	// 사용자 ID로 검색하면 상세 화면으로 이동
	if (uuidSchema.safeParse(keyword).success) {
		redirect(`/users/${keyword}`);
	}

	const period = toDashboardPeriod(searchParams.period);
	// 직접 고른 날짜가 없으면 기간 버튼의 일수로 조회
	const customDashboardParams = toDashboardParams(searchParams.date_from, searchParams.date_to);
	const dashboardParams = customDashboardParams ?? { date_from: addDays(today, 1 - period), date_to: today };

	const userFilters = toUserFilters(searchParams);
	const is_deleted = searchParams.is_deleted === 'true';
	const sort = userSortSchema.safeParse(searchParams.sort).data ?? 'created_at';
	const order = sortOrderSchema.safeParse(searchParams.order).data ?? 'desc';
	const listParams = {
		page: toPageNumber(searchParams.page),
		keyword,
		is_deleted,
		sort,
		order,
		...toUserFilterParams(userFilters, today),
	};

	// 링크가 유지할 현재 주소의 쿼리
	const listQuery = {
		keyword,
		...userFilters,
		is_deleted: is_deleted || undefined,
		sort: sort === 'created_at' ? undefined : sort,
		order: order === 'desc' ? undefined : order,
	};
	const query = { ...(customDashboardParams ?? { period }), ...listQuery };

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(getUserDashboardOptions(dashboardParams));
	void queryClient.prefetchQuery(getUserListOptions(listParams));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Users
				period={customDashboardParams ? undefined : period}
				dashboardParams={dashboardParams}
				listParams={listParams}
				userFilters={userFilters}
				listQuery={listQuery}
				query={query}
				today={today}
				now={getNow()}
			/>
		</HydrationBoundary>
	);
}
