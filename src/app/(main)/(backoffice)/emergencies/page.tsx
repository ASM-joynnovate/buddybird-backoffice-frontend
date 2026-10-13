import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { platformSchema } from '@/types/apis/app-updates';
import { emergencyKindSchema, emergencyNotificationStateSchema } from '@/types/apis/emergencies';
import { localDateSchema, uuidSchema } from '@/types/apis/primitives';

import { getEmergencyDashboardOptions } from '@/hooks/apis/dashboard';
import { getEmergencyListOptions } from '@/hooks/apis/emergencies';

import { getQueryClient } from '@/lib/query-client';

import { z } from 'zod';

import Emergencies from '@/app/(main)/(backoffice)/emergencies/_components/emergencies';
import { addDays, formatToday, getNow } from '@/utils/date';
import { toDashboardParams, toDashboardPeriod, toOptionalText, toPageNumber } from '@/utils/search-params';

/** 응급 상황 목록 페이지 */
export default async function Page(props: PageProps<'/emergencies'>) {
	const searchParams = await props.searchParams;
	const today = formatToday();

	const period = toDashboardPeriod(searchParams.period);
	// 직접 선택한 날짜가 없으면 기간 버튼의 일수로 조회
	const customDashboardParams = toDashboardParams(searchParams.date_from, searchParams.date_to);
	const dashboardParams = customDashboardParams ?? { date_from: addDays(today, 1 - period), date_to: today };

	const keyword = toOptionalText(searchParams.keyword);
	const kind = emergencyKindSchema.safeParse(searchParams.kind).data;
	const is_ongoing = z.stringbool({ truthy: ['true'], falsy: ['false'] }).safeParse(searchParams.is_ongoing).data;
	const notification = emergencyNotificationStateSchema.safeParse(searchParams.notification).data;
	const platform = platformSchema.safeParse(searchParams.platform).data;
	// 조회 기간 밖의 날짜는 무시
	const date = localDateSchema
		.refine((value) => value >= dashboardParams.date_from && value <= dashboardParams.date_to)
		.safeParse(searchParams.date).data;

	const listParams = {
		page: toPageNumber(searchParams.page),
		// 검색어가 사용자 ID이면 그 사용자의 응급 상황만 조회
		...(uuidSchema.safeParse(keyword).success ? { user_id: keyword } : { keyword }),
		occurred_from: date ?? dashboardParams.date_from,
		occurred_to: date ?? dashboardParams.date_to,
		kind,
		is_ongoing,
		notification,
		platform,
	};

	// 링크가 유지할 현재 주소의 쿼리
	const listQuery = { keyword, kind, is_ongoing, notification, platform };
	const query = { ...(customDashboardParams ?? { period }), ...listQuery, date };

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(getEmergencyDashboardOptions(dashboardParams));
	void queryClient.prefetchQuery(getEmergencyListOptions(listParams));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Emergencies
				period={customDashboardParams ? undefined : period}
				dashboardParams={dashboardParams}
				listParams={listParams}
				keyword={keyword}
				date={date}
				listQuery={listQuery}
				query={query}
				today={today}
				now={getNow()}
			/>
		</HydrationBoundary>
	);
}
