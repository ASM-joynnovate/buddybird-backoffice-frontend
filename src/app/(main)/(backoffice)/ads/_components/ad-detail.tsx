import type { Ad, AdStatsParams } from '@/types/apis/ads';

import type { SearchParamValue } from '@/lib/api';

import { Pencil } from 'lucide-react';

import PeriodFilter from '@/app/(main)/(backoffice)/_components/period-filter';
import AdDetailStatCharts from '@/app/(main)/(backoffice)/ads/_components/ad-detail-stat-charts';
import AdStatChartsSkeleton from '@/app/(main)/(backoffice)/ads/_components/ad-stat-charts-skeleton';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Button } from '@/components/ui/button';

interface Props {
	ad: Ad;
	statsParams: AdStatsParams;
	period?: number;
	listQuery: Record<string, SearchParamValue>;
	today: string;
	onEdit: () => void;
}

/**
 * 광고 표에서 펼친 행의 상세 컴포넌트
 * @param ad 펼친 행의 광고
 * @param statsParams 통계 조회 조건
 * @param period 선택된 기간 버튼의 일수
 * @param listQuery 기간을 제외한 현재 주소의 쿼리
 * @param today 오늘 날짜
 * @param onEdit "수정" 버튼을 누르면 실행할 함수
 */
const AdDetail = ({ ad, statsParams, period, listQuery, today, onEdit }: Props) => {
	return (
		<div className="grid gap-4.5 rounded-lg bg-card-inset p-4 ring-1 ring-border">
			<div className="flex flex-wrap items-center gap-2.5">
				<Button variant="outline" onClick={onEdit}>
					<Pencil />
					수정
				</Button>

				<PeriodFilter
					pathname="/ads"
					query={listQuery}
					period={period}
					dashboardParams={statsParams}
					today={today}
				/>
			</div>

			{/*조회 기간이 변경되면 다시 마운트*/}
			<ErrorHandlingWrapper
				key={[statsParams.date_from, statsParams.date_to].join(':')}
				fallbackComponent={QueryError}
				suspenseFallback=<AdStatChartsSkeleton />
			>
				<AdDetailStatCharts ad={ad} statsParams={statsParams} today={today} />
			</ErrorHandlingWrapper>
		</div>
	);
};

export default AdDetail;
