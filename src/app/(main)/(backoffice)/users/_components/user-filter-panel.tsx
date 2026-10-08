'use client';

import type { DashboardParams } from '@/types/apis/dashboard';

import type { FilterGroup } from '@/types/filter';

import { useGetUserDashboard } from '@/hooks/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import FilterPanel from '@/app/(main)/(backoffice)/_components/filter-panel';
import UserFilterIcon from '@/app/(main)/(backoffice)/users/_components/user-filter-icon';
import { USER_FILTER_GROUPS } from '@/config/user-filters';

interface Props {
	dashboardParams: DashboardParams;
	query: Record<string, SearchParamValue>;
}

/**
 * 사용자 필터 패널 컴포넌트
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param query 현재 주소의 쿼리
 */
const UserFilterPanel = ({ dashboardParams, query }: Props) => {
	const { data: userDashboardData } = useGetUserDashboard(dashboardParams);

	const filterGroups: FilterGroup[] = [
		...USER_FILTER_GROUPS.map((filterGroup) => ({
			name: filterGroup.name,
			label: filterGroup.label,
			options: filterGroup.options.map((filterOption) => ({
				value: filterOption.value,
				label: filterOption.label,
				count: userDashboardData.last_sessions.find(
					({ last_session }) => last_session === filterOption.listParams?.last_session,
				)?.count,
				icon: <UserFilterIcon listParams={filterOption.listParams} />,
			})),
		})),
		{ name: 'is_deleted', label: '계정 상태', options: [{ value: true, label: '삭제됨' }] },
	];

	return (
		<FilterPanel pathname="/users" query={query} filterGroups={filterGroups} className="md:w-[min(560px,100cqw)]" />
	);
};

export default UserFilterPanel;
