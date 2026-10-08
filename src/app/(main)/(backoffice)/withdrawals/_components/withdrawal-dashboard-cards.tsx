'use client';

import type { DashboardParams } from '@/types/apis/dashboard';

import { useGetWithdrawalDashboard } from '@/hooks/apis/dashboard';

import CompositionCard from '@/app/(main)/(backoffice)/withdrawals/_components/composition-card';
import ErrorCard from '@/app/(main)/(backoffice)/withdrawals/_components/error-card';
import WithdrawalTrendCard from '@/app/(main)/(backoffice)/withdrawals/_components/withdrawal-trend-card';

interface Props {
	dashboardParams: DashboardParams;
	today: string;
}

/**
 * 탈퇴 대시보드 카드 목록 컴포넌트
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param today 오늘 날짜
 */
const WithdrawalDashboardCards = ({ dashboardParams, today }: Props) => {
	const { data: withdrawalDashboardData } = useGetWithdrawalDashboard(dashboardParams);

	return (
		<div className="grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)]">
			<WithdrawalTrendCard withdrawalDashboard={withdrawalDashboardData} today={today} />
			<CompositionCard withdrawalDashboard={withdrawalDashboardData} />
			<ErrorCard errors={withdrawalDashboardData.errors} />
		</div>
	);
};

export default WithdrawalDashboardCards;
