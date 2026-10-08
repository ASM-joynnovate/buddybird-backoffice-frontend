import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { platformSchema } from '@/types/apis/app-updates';
import { feedbackLocaleSchema } from '@/types/apis/feedback';
import { localDateSchema, uuidSchema } from '@/types/apis/primitives';

import { getFeedbackDashboardOptions } from '@/hooks/apis/dashboard';
import { getFeedbackListOptions } from '@/hooks/apis/feedback';

import { getQueryClient } from '@/lib/query-client';

import Feedback from '@/app/(main)/(backoffice)/feedback/_components/feedback';
import { addDays, formatToday, getNow } from '@/utils/date';
import { toDashboardParams, toDashboardPeriod, toOptionalText, toPageNumber } from '@/utils/search-params';

/** 피드백 목록 페이지 */
export default async function Page(props: PageProps<'/feedback'>) {
	const searchParams = await props.searchParams;
	const today = formatToday();

	const period = toDashboardPeriod(searchParams.period);
	// 직접 고른 날짜가 없으면 기간 버튼의 일수로 조회
	const customDashboardParams = toDashboardParams(searchParams.date_from, searchParams.date_to);
	const dashboardParams = customDashboardParams ?? { date_from: addDays(today, 1 - period), date_to: today };

	const keyword = toOptionalText(searchParams.keyword);
	const app_version = toOptionalText(searchParams.app_version);
	const platform = platformSchema.safeParse(searchParams.platform).data;
	const locale = feedbackLocaleSchema.safeParse(searchParams.locale).data;
	// 조회 기간 밖의 날짜는 무시
	const date = localDateSchema
		.refine((value) => value >= dashboardParams.date_from && value <= dashboardParams.date_to)
		.safeParse(searchParams.date).data;

	const listParams = {
		page: toPageNumber(searchParams.page),
		// 검색어가 사용자 ID이면 작성자로 조회
		...(uuidSchema.safeParse(keyword).success ? { user_id: keyword } : { keyword }),
		created_from: date ?? dashboardParams.date_from,
		created_to: date ?? dashboardParams.date_to,
		app_version,
		platform,
		locale,
	};

	// 링크가 유지할 현재 주소의 쿼리
	const listQuery = { keyword, app_version, platform, locale };
	const query = { ...(customDashboardParams ?? { period }), ...listQuery, date };

	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(getFeedbackDashboardOptions(dashboardParams));
	void queryClient.prefetchQuery(getFeedbackListOptions(listParams));

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Feedback
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
