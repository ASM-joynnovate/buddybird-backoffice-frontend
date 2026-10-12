import type { DashboardParams, StabilityIssueSort } from '@/types/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import PeriodFilter from '@/app/(main)/(backoffice)/_components/period-filter';
import AnalyticsCards from '@/app/(main)/(backoffice)/analytics/_components/analytics-cards';
import AnalyticsCardsSkeleton from '@/app/(main)/(backoffice)/analytics/_components/analytics-cards-skeleton';
import ReachCard from '@/app/(main)/(backoffice)/analytics/_components/reach-card';
import ReachCardSkeleton from '@/app/(main)/(backoffice)/analytics/_components/reach-card-skeleton';
import ServiceLinks from '@/app/(main)/(backoffice)/analytics/_components/service-links';
import StabilityCards from '@/app/(main)/(backoffice)/analytics/_components/stability-cards';
import StabilityCardsSkeleton from '@/app/(main)/(backoffice)/analytics/_components/stability-cards-skeleton';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

interface Props {
	period?: number;
	dashboardParams: DashboardParams;
	sort: StabilityIssueSort;
	listQuery: Record<string, SearchParamValue>;
	query: Record<string, SearchParamValue>;
	today: string;
	now: number;
}

/**
 * 분석 화면 컴포넌트
 * @param period 선택된 기간 버튼의 일수
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param sort 이슈 정렬 기준
 * @param listQuery 기간을 뺀 현재 주소의 쿼리
 * @param query 현재 주소의 쿼리
 * @param today 오늘 날짜
 * @param now 서버가 화면을 그린 시각
 */
const Analytics = ({ period, dashboardParams, sort, listQuery, query, today, now }: Props) => {
	const periodKey = [dashboardParams.date_from, dashboardParams.date_to].join(':');

	return (
		<>
			{/*넓은 화면에서는 제목 줄을 아래 카드의 두 열에 맞춤*/}
			<div className="@container">
				<div className="flex flex-wrap items-center gap-2.5 @min-[1520px]:grid @min-[1520px]:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] @min-[1520px]:gap-4">
					<div className="contents @min-[1520px]:flex @min-[1520px]:items-center @min-[1520px]:justify-between @min-[1520px]:gap-2.5">
						<h1 className="mr-auto text-2xl font-bold">분석</h1>

						<ServiceLinks />
					</div>

					<div className="contents @min-[1520px]:flex @min-[1520px]:justify-end">
						<PeriodFilter
							pathname="/analytics"
							query={listQuery}
							period={period}
							dashboardParams={dashboardParams}
							today={today}
						/>
					</div>
				</div>
			</div>

			{/*조회 기간이 바뀌면 다시 마운트*/}
			<ErrorHandlingWrapper
				key={`reach:${periodKey}`}
				fallbackComponent={QueryError}
				suspenseFallback=<ReachCardSkeleton />
			>
				<ReachCard dashboardParams={dashboardParams} today={today} />
			</ErrorHandlingWrapper>

			<hr />

			{/*정렬이 바뀌어도 이전 목록을 유지*/}
			<ErrorHandlingWrapper
				key={`stability:${periodKey}`}
				fallbackComponent={QueryError}
				suspenseFallback=<StabilityCardsSkeleton />
			>
				<StabilityCards dashboardParams={dashboardParams} sort={sort} query={query} now={now} />
			</ErrorHandlingWrapper>

			<hr />

			<ErrorHandlingWrapper
				key={`analytics:${periodKey}`}
				fallbackComponent={QueryError}
				suspenseFallback=<AnalyticsCardsSkeleton />
			>
				<AnalyticsCards dashboardParams={dashboardParams} />
			</ErrorHandlingWrapper>
		</>
	);
};

export default Analytics;
