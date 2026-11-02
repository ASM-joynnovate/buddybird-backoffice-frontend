'use client';

import { type AdStatsParams, adKindSchema } from '@/types/apis/ads';

import { useGetAdTotalStats } from '@/hooks/apis/ads';

import AdStatCharts from '@/app/(main)/(backoffice)/ads/_components/ad-stat-charts';

interface Props {
	statsParams: AdStatsParams;
	today: string;
}

/**
 * 모든 광고의 일별 노출 수 및 클릭 수 그래프 컴포넌트
 * @param statsParams 통계 조회 조건
 * @param today 오늘 날짜
 */
const AdTotalStatCharts = ({ statsParams, today }: Props) => {
	const { data: totalStats } = useGetAdTotalStats(statsParams);

	return (
		<AdStatCharts stats={totalStats} adKinds={adKindSchema.options} dashboardParams={statsParams} today={today} />
	);
};

export default AdTotalStatCharts;
