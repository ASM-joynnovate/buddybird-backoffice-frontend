'use client';

import type { DashboardParams } from '@/types/apis/dashboard';

import { useGetEmergencyDashboard } from '@/hooks/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import EmergencyHourCard from '@/app/(main)/(backoffice)/emergencies/_components/emergency-hour-card';
import EmergencyTrendCard from '@/app/(main)/(backoffice)/emergencies/_components/emergency-trend-card';
import EmergencyUserCard from '@/app/(main)/(backoffice)/emergencies/_components/emergency-user-card';

interface Props {
	dashboardParams: DashboardParams;
	date?: string;
	query: Record<string, SearchParamValue>;
	today: string;
}

/**
 * 응급 상황 대시보드 카드 목록 컴포넌트
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param date "응급 상황 추이"에서 선택한 날짜
 * @param query 현재 주소의 쿼리
 * @param today 오늘 날짜
 */
const EmergencyDashboardCards = ({ dashboardParams, date, query, today }: Props) => {
	const { data: emergencyDashboardData } = useGetEmergencyDashboard(dashboardParams);

	return (
		<>
			<EmergencyTrendCard
				emergencyDashboard={emergencyDashboardData}
				selectedDate={date}
				query={query}
				today={today}
			/>
			<EmergencyHourCard hourly={emergencyDashboardData.hourly} />
			<EmergencyUserCard users={emergencyDashboardData.users} query={query} />
		</>
	);
};

export default EmergencyDashboardCards;
