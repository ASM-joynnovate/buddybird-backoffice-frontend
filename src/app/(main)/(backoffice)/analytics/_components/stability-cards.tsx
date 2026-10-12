'use client';

import type { DashboardParams, StabilityIssueSort } from '@/types/apis/dashboard';

import { useGetStabilityDashboard } from '@/hooks/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import CrashFreeCard from '@/app/(main)/(backoffice)/analytics/_components/crash-free-card';
import IssueCard from '@/app/(main)/(backoffice)/analytics/_components/issue-card';
import ProjectErrorCard from '@/app/(main)/(backoffice)/analytics/_components/project-error-card';

interface Props {
	dashboardParams: DashboardParams;
	sort: StabilityIssueSort;
	query: Record<string, SearchParamValue>;
	now: number;
}

/**
 * Sentry의 이슈, 충돌 없는 사용자, 프로젝트별 오류 카드 목록 컴포넌트
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param sort 이슈 정렬 기준
 * @param query 현재 주소의 쿼리
 * @param now 서버가 화면을 그린 시각
 */
const StabilityCards = ({ dashboardParams, sort, query, now }: Props) => {
	const { data: stabilityDashboardData } = useGetStabilityDashboard({ dashboardParams, sort });

	return (
		<div className="grid items-start gap-4 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
			<IssueCard
				issues={stabilityDashboardData.issues}
				sort={sort}
				dateFrom={dashboardParams.date_from}
				query={query}
				now={now}
			/>

			<div className="grid gap-4">
				<CrashFreeCard projects={stabilityDashboardData.projects} releases={stabilityDashboardData.releases} />
				<ProjectErrorCard projects={stabilityDashboardData.projects} />
			</div>
		</div>
	);
};

export default StabilityCards;
