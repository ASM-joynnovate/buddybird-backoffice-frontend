import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { type AdListParams, type AdStatsParams, adKindSchema, adStatusSchema } from '@/types/apis/ads';
import { countrySchema } from '@/types/apis/primitives';

import { getAdListOptions, getAdTotalStatsOptions } from '@/hooks/apis/ads';

import { getQueryClient } from '@/lib/query-client';

import { z } from 'zod';

import Ads from '@/app/(main)/(backoffice)/ads/_components/ads';
import { addDays, formatToday, getNow } from '@/utils/date';
import { toDashboardParams, toDashboardPeriod, toPageNumber } from '@/utils/search-params';

/** 광고 페이지 */
export default async function Page(props: PageProps<'/ads'>) {
	const searchParams = await props.searchParams;
	const today = formatToday();

	const period = toDashboardPeriod(searchParams.period);
	// 직접 선택한 날짜가 없으면 기간 버튼의 일수로 조회
	const customDashboardParams = toDashboardParams(searchParams.date_from, searchParams.date_to);
	const dashboardParams = customDashboardParams ?? { date_from: addDays(today, 1 - period), date_to: today };
	// 그래프는 일 단위
	const statsParams: AdStatsParams = { ...dashboardParams, interval: 'day' };

	const kind = adKindSchema.safeParse(searchParams.kind).data;
	const status = adStatusSchema.safeParse(searchParams.status).data;
	const is_ad = z.stringbool({ truthy: ['true'], falsy: ['false'] }).safeParse(searchParams.is_ad).data;
	const country = countrySchema.safeParse(searchParams.country).data;

	const listParams: AdListParams = { page: toPageNumber(searchParams.page), kind, status, is_ad, country };
	// 순서를 변경할 홈 배너는 한 번에 조회
	const orderListParams: AdListParams = { page: 1, count_by_page: 100, kind: 'home_banner' };

	// 링크가 유지할 현재 주소의 쿼리
	const listQuery = { kind, status, is_ad, country };
	const query = { ...(customDashboardParams ?? { period }), ...listQuery };

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(getAdTotalStatsOptions(statsParams));
	void queryClient.prefetchQuery(getAdListOptions(orderListParams));
	void queryClient.prefetchQuery(getAdListOptions(listParams));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Ads
				period={customDashboardParams ? undefined : period}
				statsParams={statsParams}
				listParams={listParams}
				orderListParams={orderListParams}
				listQuery={listQuery}
				query={query}
				today={today}
				now={getNow()}
			/>
		</HydrationBoundary>
	);
}
