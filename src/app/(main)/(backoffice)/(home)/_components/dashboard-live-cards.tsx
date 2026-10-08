'use client';

import { useGetDashboardLive } from '@/hooks/apis/dashboard';

import CheckItemCard from '@/app/(main)/(backoffice)/(home)/_components/check-item-card';
import RunningSessionCard from '@/app/(main)/(backoffice)/(home)/_components/running-session-card';

/** 현재 상태 카드 목록 컴포넌트 */
const DashboardLiveCards = () => {
	const { data: dashboardLiveData } = useGetDashboardLive();

	return (
		<div className="grid gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
			<RunningSessionCard dashboardLive={dashboardLiveData} />
			<CheckItemCard dashboardLive={dashboardLiveData} />
		</div>
	);
};

export default DashboardLiveCards;
