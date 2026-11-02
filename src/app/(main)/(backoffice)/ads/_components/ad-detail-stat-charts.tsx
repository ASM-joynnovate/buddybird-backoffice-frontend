'use client';

import type { Ad, AdStatsParams } from '@/types/apis/ads';

import { useGetAdStats } from '@/hooks/apis/ads';

import AdStatCharts from '@/app/(main)/(backoffice)/ads/_components/ad-stat-charts';

interface Props {
	ad: Ad;
	statsParams: AdStatsParams;
	today: string;
}

/**
 * 광고 하나의 일별 노출 수 및 클릭 수 그래프 컴포넌트
 * @param ad 통계를 조회할 광고
 * @param statsParams 통계 조회 조건
 * @param today 오늘 날짜
 */
const AdDetailStatCharts = ({ ad, statsParams, today }: Props) => {
	const { data: adStats } = useGetAdStats(ad.id, statsParams);

	return (
		<AdStatCharts
			stats={adStats.map((adStat) => ({ ...adStat, ad_kind: ad.kind }))}
			adKinds={[ad.kind]}
			dashboardParams={statsParams}
			today={today}
		/>
	);
};

export default AdDetailStatCharts;
