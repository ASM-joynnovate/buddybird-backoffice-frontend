'use client';

import type { DashboardParams } from '@/types/apis/dashboard';

import { useGetUserDashboard } from '@/hooks/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import ActiveUserCard from '@/app/(main)/(backoffice)/users/_components/active-user-card';
import CompositionCard from '@/app/(main)/(backoffice)/users/_components/composition-card';
import LastSessionCard from '@/app/(main)/(backoffice)/users/_components/last-session-card';
import SpeciesCard from '@/app/(main)/(backoffice)/users/_components/species-card';
import UserTrendCard from '@/app/(main)/(backoffice)/users/_components/user-trend-card';

interface Props {
	dashboardParams: DashboardParams;
	query: Record<string, SearchParamValue>;
	today: string;
}

/**
 * 사용자 대시보드 카드 목록 컴포넌트
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param query 현재 주소의 쿼리
 * @param today 오늘 날짜
 */
const UserDashboardCards = ({ dashboardParams, query, today }: Props) => {
	const { data: userDashboardData } = useGetUserDashboard(dashboardParams);

	return (
		<div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
			<UserTrendCard userDashboard={userDashboardData} today={today} />
			<LastSessionCard
				lastSessions={userDashboardData.last_sessions}
				userCount={userDashboardData.users.total_count}
				query={query}
			/>
			<ActiveUserCard daily={userDashboardData.daily} today={today} />
			<CompositionCard userDashboard={userDashboardData} query={query} />
			<SpeciesCard parrots={userDashboardData.parrots} />
		</div>
	);
};

export default UserDashboardCards;
