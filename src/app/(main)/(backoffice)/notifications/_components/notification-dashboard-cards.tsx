'use client';

import type { DashboardParams } from '@/types/apis/dashboard';

import { useGetNotificationDashboard } from '@/hooks/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import KindReadCard from '@/app/(main)/(backoffice)/notifications/_components/kind-read-card';
import NotificationTrendCard from '@/app/(main)/(backoffice)/notifications/_components/notification-trend-card';

interface Props {
	dashboardParams: DashboardParams;
	date?: string;
	query: Record<string, SearchParamValue>;
	today: string;
}

/**
 * 알림 대시보드 카드 목록 컴포넌트
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param date "알림 추이"에서 고른 날짜
 * @param query 현재 주소의 쿼리
 * @param today 오늘 날짜
 */
const NotificationDashboardCards = ({ dashboardParams, date, query, today }: Props) => {
	const { data: notificationDashboardData } = useGetNotificationDashboard(dashboardParams);

	return (
		<>
			<NotificationTrendCard
				notificationDashboard={notificationDashboardData}
				selectedDate={date}
				query={query}
				today={today}
			/>
			<KindReadCard notificationDashboard={notificationDashboardData} query={query} />
		</>
	);
};

export default NotificationDashboardCards;
