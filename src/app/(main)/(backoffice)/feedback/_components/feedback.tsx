import type { DashboardParams } from '@/types/apis/dashboard';
import type { FeedbackListParams } from '@/types/apis/feedback';

import type { SelectedFilter } from '@/types/filter';

import type { SearchParamValue } from '@/lib/api';

import dayjs from 'dayjs';

import PeriodFilter from '@/app/(main)/(backoffice)/_components/period-filter';
import PlatformIcon from '@/app/(main)/(backoffice)/_components/platform-icon';
import SearchBar from '@/app/(main)/(backoffice)/_components/search-bar';
import FeedbackDashboardCards from '@/app/(main)/(backoffice)/feedback/_components/feedback-dashboard-cards';
import FeedbackDashboardSkeleton from '@/app/(main)/(backoffice)/feedback/_components/feedback-dashboard-skeleton';
import FeedbackFilterPanel from '@/app/(main)/(backoffice)/feedback/_components/feedback-filter-panel';
import FeedbackList from '@/app/(main)/(backoffice)/feedback/_components/feedback-list';
import FeedbackListSkeleton from '@/app/(main)/(backoffice)/feedback/_components/feedback-list-skeleton';
import FeedbackResultCount from '@/app/(main)/(backoffice)/feedback/_components/feedback-result-count';
import { FEEDBACK_FILTER_LABELS } from '@/config/feedback-filters';
import { toLocaleName } from '@/utils/locale';
import { toPlatformName } from '@/utils/platform';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

interface Props {
	period?: number;
	dashboardParams: DashboardParams;
	listParams: FeedbackListParams;
	keyword?: string;
	date?: string;
	listQuery: Record<string, SearchParamValue>;
	query: Record<string, SearchParamValue>;
	today: string;
	now: number;
}

/**
 * 피드백 화면 컴포넌트
 * @param period 선택된 기간 버튼의 일수
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param listParams 목록 조회 조건
 * @param keyword 검색 입력에 적은 검색어
 * @param date "피드백 추이"에서 고른 날짜
 * @param listQuery 기간 및 날짜를 뺀 현재 주소의 쿼리
 * @param query 현재 주소의 쿼리
 * @param today 오늘 날짜
 * @param now 서버가 화면을 그린 시각
 */
const Feedback = ({ period, dashboardParams, listParams, keyword, date, listQuery, query, today, now }: Props) => {
	const { app_version, platform, locale } = listParams;

	const panelFilters: SelectedFilter[] = [
		...(app_version
			? [{ name: 'app_version', groupLabel: FEEDBACK_FILTER_LABELS.app_version, label: app_version }]
			: []),
		...(platform
			? [
					{
						name: 'platform',
						groupLabel: FEEDBACK_FILTER_LABELS.platform,
						label: toPlatformName(platform),
						icon: <PlatformIcon platform={platform} />,
					},
				]
			: []),
		...(locale ? [{ name: 'locale', groupLabel: FEEDBACK_FILTER_LABELS.locale, label: toLocaleName(locale) }] : []),
	];
	const selectedFilters: SelectedFilter[] = [
		...(date ? [{ name: 'date', groupLabel: '날짜', label: dayjs(date).format('M월 D일') }] : []),
		...panelFilters,
	];

	return (
		<>
			<div className="flex flex-wrap items-center justify-between gap-2.5">
				<h1 className="text-2xl font-bold">피드백</h1>

				<PeriodFilter
					pathname="/feedback"
					query={listQuery}
					period={period}
					dashboardParams={dashboardParams}
					today={today}
				/>
			</div>

			<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
				<div className="min-w-0 space-y-4">
					<SearchBar
						pathname="/feedback"
						placeholder="내용, 닉네임, 이메일, 사용자 ID"
						keyword={keyword}
						query={query}
						selectedFilters={selectedFilters}
						filterCount={panelFilters.length}
						filterPanel=<FeedbackFilterPanel dashboardParams={dashboardParams} query={query} />
					>
						{(!!keyword || selectedFilters.length > 0) && (
							<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback={null}>
								<FeedbackResultCount listParams={listParams} />
							</ErrorHandlingWrapper>
						)}
					</SearchBar>

					{/*조건이 바뀌어도 이전 목록을 유지해 행 이동 전환 실행*/}
					<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<FeedbackListSkeleton />>
						<FeedbackList
							listParams={listParams}
							keyword={keyword}
							filterSelected={selectedFilters.length > 0}
							query={query}
							initialNow={now}
						/>
					</ErrorHandlingWrapper>
				</div>

				{/*한 열일 때는 목록 위에 표시*/}
				<div className="grid grid-cols-[minmax(0,1fr)] gap-4 max-xl:order-first xl:sticky xl:top-2">
					{/*조회 기간이 바뀌면 다시 마운트*/}
					<ErrorHandlingWrapper
						key={[dashboardParams.date_from, dashboardParams.date_to].join(':')}
						fallbackComponent={QueryError}
						suspenseFallback=<FeedbackDashboardSkeleton />
					>
						<FeedbackDashboardCards
							dashboardParams={dashboardParams}
							date={date}
							query={query}
							today={today}
						/>
					</ErrorHandlingWrapper>
				</div>
			</div>
		</>
	);
};

export default Feedback;
