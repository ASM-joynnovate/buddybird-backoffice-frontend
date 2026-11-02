import type { AdListParams, AdStatsParams } from '@/types/apis/ads';

import type { SelectedFilter } from '@/types/filter';

import type { SearchParamValue } from '@/lib/api';

import CountryFlag from '@/app/(main)/(backoffice)/_components/country-flag';
import FilterButton from '@/app/(main)/(backoffice)/_components/filter-button';
import PeriodFilter from '@/app/(main)/(backoffice)/_components/period-filter';
import SelectedFilters from '@/app/(main)/(backoffice)/_components/selected-filters';
import AdFilterPanel from '@/app/(main)/(backoffice)/ads/_components/ad-filter-panel';
import AdStatChartsSkeleton from '@/app/(main)/(backoffice)/ads/_components/ad-stat-charts-skeleton';
import AdStatusIcon from '@/app/(main)/(backoffice)/ads/_components/ad-status-icon';
import AdTable from '@/app/(main)/(backoffice)/ads/_components/ad-table';
import AdTableSkeleton from '@/app/(main)/(backoffice)/ads/_components/ad-table-skeleton';
import AdTotalStatCharts from '@/app/(main)/(backoffice)/ads/_components/ad-total-stat-charts';
import CreateAdButton from '@/app/(main)/(backoffice)/ads/_components/create-ad-button';
import HomeBannerOrderCard from '@/app/(main)/(backoffice)/ads/_components/home-banner-order-card';
import HomeBannerOrderSkeleton from '@/app/(main)/(backoffice)/ads/_components/home-banner-order-skeleton';
import { AD_FILTER_LABELS, AD_KINDS, AD_STATUSES, AD_TYPES } from '@/config/ad';
import { toCountryName } from '@/utils/country';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
	period?: number;
	statsParams: AdStatsParams;
	listParams: AdListParams;
	orderListParams: AdListParams;
	listQuery: Record<string, SearchParamValue>;
	query: Record<string, SearchParamValue>;
	today: string;
	now: number;
}

/**
 * 광고 화면 컴포넌트
 * @param period 선택된 기간 버튼의 일수
 * @param statsParams 통계 조회 조건
 * @param listParams 목록 조회 조건
 * @param orderListParams 순서를 변경할 홈 배너의 조회 조건
 * @param listQuery 기간을 제외한 현재 주소의 쿼리
 * @param query 현재 주소의 쿼리
 * @param today 오늘 날짜
 * @param now 서버가 화면을 렌더링한 시각
 */
const Ads = ({ period, statsParams, listParams, orderListParams, listQuery, query, today, now }: Props) => {
	const { kind, status, is_ad, country } = listParams;

	const selectedFilters: SelectedFilter[] = [
		...(kind ? [{ name: 'kind', groupLabel: AD_FILTER_LABELS.kind, label: AD_KINDS[kind].label }] : []),
		...(status
			? [
					{
						name: 'status',
						groupLabel: AD_FILTER_LABELS.status,
						label: AD_STATUSES[status],
						icon: <AdStatusIcon status={status} className="size-3.5" />,
					},
				]
			: []),
		...(is_ad !== undefined
			? [{ name: 'is_ad', groupLabel: AD_FILTER_LABELS.is_ad, label: is_ad ? AD_TYPES.ad : AD_TYPES.info }]
			: []),
		...(country
			? [
					{
						name: 'country',
						groupLabel: AD_FILTER_LABELS.country,
						label: toCountryName(country),
						icon: <CountryFlag country={country} className="w-4" />,
					},
				]
			: []),
	];

	return (
		<>
			<div className="flex items-center justify-between gap-2.5">
				<h1 className="text-2xl font-bold">광고</h1>

				<CreateAdButton />
			</div>

			<Card className="gap-3.5 py-4.5">
				{/*좁은 화면에서는 기간 선택을 제목 아래에 표시*/}
				<CardHeader className="flex flex-wrap items-center justify-between gap-2.5 px-5">
					<CardTitle className="font-bold">전체 광고</CardTitle>

					<PeriodFilter
						pathname="/ads"
						query={listQuery}
						period={period}
						dashboardParams={statsParams}
						today={today}
					/>
				</CardHeader>

				<CardContent className="px-5">
					{/*조회 기간이 변경되면 다시 마운트*/}
					<ErrorHandlingWrapper
						key={[statsParams.date_from, statsParams.date_to].join(':')}
						fallbackComponent={QueryError}
						suspenseFallback=<AdStatChartsSkeleton />
					>
						<AdTotalStatCharts statsParams={statsParams} today={today} />
					</ErrorHandlingWrapper>
				</CardContent>
			</Card>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<HomeBannerOrderSkeleton />>
				<HomeBannerOrderCard listParams={orderListParams} now={now} />
			</ErrorHandlingWrapper>

			{/*좁은 화면에서 필터 패널의 위치 기준*/}
			<div className="@container relative flex items-center gap-2">
				<FilterButton filterCount={selectedFilters.length}>
					<AdFilterPanel dashboardParams={statsParams} query={query} />
				</FilterButton>

				{/*넘치면 가로로 스크롤*/}
				<div className="-m-1 flex min-w-0 flex-1 [scrollbar-width:none] items-center gap-2 overflow-x-auto p-1">
					<SelectedFilters pathname="/ads" query={query} selectedFilters={selectedFilters} />
				</div>
			</div>

			{/*조건이 변경되어도 이전 목록 유지*/}
			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<AdTableSkeleton />>
				<AdTable
					listParams={listParams}
					statsParams={statsParams}
					period={period}
					filterSelected={selectedFilters.length > 0}
					listQuery={listQuery}
					query={query}
					today={today}
				/>
			</ErrorHandlingWrapper>
		</>
	);
};

export default Ads;
