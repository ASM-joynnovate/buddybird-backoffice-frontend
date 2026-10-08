'use client';

import type { DashboardParams } from '@/types/apis/dashboard';

import { useGetFeedbackDashboard } from '@/hooks/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import CompositionCard from '@/app/(main)/(backoffice)/feedback/_components/composition-card';
import FeedbackTrendCard from '@/app/(main)/(backoffice)/feedback/_components/feedback-trend-card';

interface Props {
	dashboardParams: DashboardParams;
	date?: string;
	query: Record<string, SearchParamValue>;
	today: string;
}

/**
 * 피드백 대시보드 카드 목록 컴포넌트
 * @param dashboardParams 조회 기간의 시작일 및 종료일
 * @param date "피드백 추이"에서 고른 날짜
 * @param query 현재 주소의 쿼리
 * @param today 오늘 날짜
 */
const FeedbackDashboardCards = ({ dashboardParams, date, query, today }: Props) => {
	const { data: feedbackDashboardData } = useGetFeedbackDashboard(dashboardParams);

	return (
		<>
			<FeedbackTrendCard
				feedbackDashboard={feedbackDashboardData}
				selectedDate={date}
				query={query}
				today={today}
			/>
			<CompositionCard feedbackDashboard={feedbackDashboardData} query={query} />
		</>
	);
};

export default FeedbackDashboardCards;
