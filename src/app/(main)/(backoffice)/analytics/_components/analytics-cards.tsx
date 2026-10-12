'use client';

import type { DashboardParams } from '@/types/apis/dashboard';

import { useGetAnalyticsDashboard } from '@/hooks/apis/dashboard';

import CompositionCard from '@/app/(main)/(backoffice)/analytics/_components/composition-card';
import EventCard from '@/app/(main)/(backoffice)/analytics/_components/event-card';
import OnboardingCard from '@/app/(main)/(backoffice)/analytics/_components/onboarding-card';

interface Props {
	dashboardParams: DashboardParams;
}

/**
 * Google Analytics의 이벤트, 온보딩, 구성 카드 목록 컴포넌트
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 */
const AnalyticsCards = ({ dashboardParams }: Props) => {
	const { data: analyticsDashboardData } = useGetAnalyticsDashboard(dashboardParams);

	return (
		<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
			<EventCard events={analyticsDashboardData.events} />

			<div className="grid gap-4">
				<OnboardingCard onboarding={analyticsDashboardData.onboarding} />
				<CompositionCard
					platforms={analyticsDashboardData.platforms}
					appVersions={analyticsDashboardData.app_versions}
				/>
			</div>
		</div>
	);
};

export default AnalyticsCards;
