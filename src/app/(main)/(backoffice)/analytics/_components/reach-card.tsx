'use client';

import type { DashboardParams } from '@/types/apis/dashboard';

import { useGetUserDashboard } from '@/hooks/apis/dashboard';

import ActiveUserTrends from '@/app/(main)/(backoffice)/_components/active-user-trends';
import CountryList from '@/app/(main)/(backoffice)/_components/country-list';
import CountryMap from '@/app/(main)/(backoffice)/analytics/_components/country-map';

import { Card, CardTitle } from '@/components/ui/card';

interface Props {
	dashboardParams: DashboardParams;
	today: string;
}

/**
 * 접속 기준 활성 사용자 및 국가 카드 컴포넌트
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param today 오늘 날짜
 */
const ReachCard = ({ dashboardParams, today }: Props) => {
	const { data: userDashboardData } = useGetUserDashboard(dashboardParams);

	return (
		<Card className="grid gap-0 py-0 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
			<div className="min-w-0 px-5 py-4.5">
				<div className="mb-3.5 flex items-baseline justify-between gap-3">
					<CardTitle className="font-bold">활성 사용자</CardTitle>
					<p className="text-[13px] text-muted-foreground">접속 기준</p>
				</div>

				<ActiveUserTrends
					daily={userDashboardData.daily}
					metrics={['dau', 'wau', 'mau']}
					chartHeight={148}
					today={today}
				/>
			</div>

			<div className="grid min-w-0 content-start gap-3 border-t bg-card-inset px-5 py-4.5 xl:border-t-0 xl:border-l">
				<CardTitle className="font-bold">국가</CardTitle>

				<CountryMap countries={userDashboardData.countries} />

				<CountryList countries={userDashboardData.countries} className="gap-x-6 md:grid-cols-2" />
			</div>
		</Card>
	);
};

export default ReachCard;
