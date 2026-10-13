'use client';

import type { DashboardParams } from '@/types/apis/dashboard';

import { useGetEmergencyDashboard } from '@/hooks/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import FilterPanel from '@/app/(main)/(backoffice)/_components/filter-panel';
import PlatformIcon from '@/app/(main)/(backoffice)/_components/platform-icon';
import { toEmergencyFilterGroups } from '@/utils/emergency';

interface Props {
	dashboardParams: DashboardParams;
	query: Record<string, SearchParamValue>;
}

/**
 * 응급 상황 필터 패널 컴포넌트
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param query 현재 주소의 쿼리
 */
const EmergencyFilterPanel = ({ dashboardParams, query }: Props) => {
	const { data: emergencyDashboardData } = useGetEmergencyDashboard(dashboardParams);

	// 기기 그룹의 값 앞에만 로고 표시
	const filterGroups = toEmergencyFilterGroups(emergencyDashboardData).map((filterGroup) => ({
		...filterGroup,
		options: filterGroup.options.map((filterOption) => ({
			...filterOption,
			icon: filterGroup.name === 'platform' && <PlatformIcon platform={String(filterOption.value)} />,
		})),
	}));

	return (
		<FilterPanel
			pathname="/emergencies"
			query={query}
			filterGroups={filterGroups}
			className="md:w-[min(440px,100cqw)]"
		/>
	);
};

export default EmergencyFilterPanel;
