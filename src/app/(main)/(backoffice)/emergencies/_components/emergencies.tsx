import type { DashboardParams } from '@/types/apis/dashboard';
import type { EmergencyListParams } from '@/types/apis/emergencies';

import type { SelectedFilter } from '@/types/filter';

import type { SearchParamValue } from '@/lib/api';

import dayjs from 'dayjs';

import PeriodFilter from '@/app/(main)/(backoffice)/_components/period-filter';
import PlatformIcon from '@/app/(main)/(backoffice)/_components/platform-icon';
import SearchBar from '@/app/(main)/(backoffice)/_components/search-bar';
import EmergencyDashboardCards from '@/app/(main)/(backoffice)/emergencies/_components/emergency-dashboard-cards';
import EmergencyDashboardSkeleton from '@/app/(main)/(backoffice)/emergencies/_components/emergency-dashboard-skeleton';
import EmergencyFilterPanel from '@/app/(main)/(backoffice)/emergencies/_components/emergency-filter-panel';
import EmergencyList from '@/app/(main)/(backoffice)/emergencies/_components/emergency-list';
import EmergencyListSkeleton from '@/app/(main)/(backoffice)/emergencies/_components/emergency-list-skeleton';
import EmergencyResultCount from '@/app/(main)/(backoffice)/emergencies/_components/emergency-result-count';
import {
	EMERGENCY_FILTER_LABELS,
	EMERGENCY_KINDS,
	EMERGENCY_NOTIFICATION_STATES,
	EMERGENCY_STATES,
} from '@/config/emergency';
import { toPlatformName } from '@/utils/platform';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

interface Props {
	period?: number;
	dashboardParams: DashboardParams;
	listParams: EmergencyListParams;
	keyword?: string;
	date?: string;
	listQuery: Record<string, SearchParamValue>;
	query: Record<string, SearchParamValue>;
	today: string;
	now: number;
}

/**
 * 응급 상황 화면 컴포넌트
 * @param period 선택된 기간 버튼의 일수
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param listParams 목록 조회 조건
 * @param keyword 검색 입력에 적은 검색어
 * @param date "응급 상황 추이"에서 선택한 날짜
 * @param listQuery 기간 및 날짜를 뺀 현재 주소의 쿼리
 * @param query 현재 주소의 쿼리
 * @param today 오늘 날짜
 * @param now 서버가 화면을 그린 시각
 */
const Emergencies = ({ period, dashboardParams, listParams, keyword, date, listQuery, query, today, now }: Props) => {
	const { kind, is_ongoing, notification, platform } = listParams;

	const panelFilters: SelectedFilter[] = [
		...(kind
			? [{ name: 'kind', groupLabel: EMERGENCY_FILTER_LABELS.kind, label: EMERGENCY_KINDS[kind].label }]
			: []),
		...(is_ongoing !== undefined
			? [
					{
						name: 'is_ongoing',
						groupLabel: EMERGENCY_FILTER_LABELS.is_ongoing,
						label: is_ongoing ? EMERGENCY_STATES.ongoing : EMERGENCY_STATES.ended,
					},
				]
			: []),
		...(notification
			? [
					{
						name: 'notification',
						groupLabel: EMERGENCY_FILTER_LABELS.notification,
						label: EMERGENCY_NOTIFICATION_STATES[notification],
					},
				]
			: []),
		...(platform
			? [
					{
						name: 'platform',
						groupLabel: EMERGENCY_FILTER_LABELS.platform,
						label: toPlatformName(platform),
						icon: <PlatformIcon platform={platform} />,
					},
				]
			: []),
	];
	const selectedFilters: SelectedFilter[] = [
		...(date ? [{ name: 'date', groupLabel: '날짜', label: dayjs(date).format('M월 D일') }] : []),
		...panelFilters,
	];

	return (
		<>
			<div className="flex flex-wrap items-center justify-between gap-2.5">
				<h1 className="text-2xl font-bold">응급 상황</h1>

				<PeriodFilter
					pathname="/emergencies"
					query={listQuery}
					period={period}
					dashboardParams={dashboardParams}
					today={today}
				/>
			</div>

			<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
				<div className="min-w-0 space-y-4">
					<SearchBar
						pathname="/emergencies"
						placeholder="닉네임, 이메일, 사용자 ID"
						keyword={keyword}
						query={query}
						selectedFilters={selectedFilters}
						filterCount={panelFilters.length}
						filterPanel=<EmergencyFilterPanel dashboardParams={dashboardParams} query={query} />
					>
						{(!!keyword || selectedFilters.length > 0) && (
							<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback={null}>
								<EmergencyResultCount listParams={listParams} />
							</ErrorHandlingWrapper>
						)}
					</SearchBar>

					{/*조건이 바뀌어도 이전 목록 유지*/}
					<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<EmergencyListSkeleton />>
						<EmergencyList
							dashboardParams={dashboardParams}
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
						suspenseFallback=<EmergencyDashboardSkeleton />
					>
						<EmergencyDashboardCards
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

export default Emergencies;
