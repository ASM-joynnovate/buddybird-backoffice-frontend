'use client';

import type { DashboardParams } from '@/types/apis/dashboard';

import { useGetFeedbackDashboard } from '@/hooks/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import FilterPanel from '@/app/(main)/(backoffice)/_components/filter-panel';
import PlatformIcon from '@/app/(main)/(backoffice)/_components/platform-icon';
import { toFeedbackFilterGroups } from '@/utils/feedback';

interface Props {
	dashboardParams: DashboardParams;
	query: Record<string, SearchParamValue>;
}

/**
 * 피드백 필터 패널 컴포넌트
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param query 현재 주소의 쿼리
 */
const FeedbackFilterPanel = ({ dashboardParams, query }: Props) => {
	const { data: feedbackDashboardData } = useGetFeedbackDashboard(dashboardParams);

	// 기기 그룹의 값 앞에만 로고 표시
	const filterGroups = toFeedbackFilterGroups(feedbackDashboardData).map((filterGroup) => ({
		...filterGroup,
		options: filterGroup.options.map((filterOption) => ({
			...filterOption,
			icon: filterGroup.name === 'platform' && <PlatformIcon platform={filterOption.value} />,
		})),
	}));

	return (
		<FilterPanel
			pathname="/feedback"
			query={query}
			filterGroups={filterGroups}
			className="w-[min(440px,calc(100vw-32px))]"
		/>
	);
};

export default FeedbackFilterPanel;
