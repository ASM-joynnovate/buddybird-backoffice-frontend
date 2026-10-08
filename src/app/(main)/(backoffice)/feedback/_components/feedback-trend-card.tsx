'use client';

import { useRouter } from 'next/navigation';

import type { FeedbackDashboard } from '@/types/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import CountChange from '@/app/(main)/(backoffice)/_components/count-change';
import DailyCountChart from '@/app/(main)/(backoffice)/_components/daily-count-chart';
import StatCell from '@/app/(main)/(backoffice)/_components/stat-cell';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { toToggledQuery } from '@/utils/search-params';

interface Props {
	feedbackDashboard: FeedbackDashboard;
	selectedDate?: string;
	query: Record<string, SearchParamValue>;
	today: string;
}

/**
 * 피드백 추이 카드 컴포넌트
 * @param feedbackDashboard 피드백 대시보드 집계
 * @param selectedDate 목록에 표시할 날짜
 * @param query 현재 주소의 쿼리
 * @param today 오늘 날짜
 */
const FeedbackTrendCard = ({ feedbackDashboard, selectedDate, query, today }: Props) => {
	const router = useRouter();

	const { feedback, daily } = feedbackDashboard;

	const handleToggleDate = (date: string) => {
		const searchParams = new URLSearchParams(
			Object.entries(toToggledQuery(query, 'date', date)).map(([name, value]) => [name, String(value)]),
		);

		router.push(`/feedback?${searchParams.toString()}`, { scroll: false });
	};

	return (
		<TitledCard title="피드백 추이">
			<p className="text-[44px] leading-[1.1] font-bold tracking-[-0.025em] whitespace-nowrap">
				{feedback.count.toLocaleString('ko-KR')}
				<span className="ml-0.5 text-lg font-semibold tracking-normal text-muted-foreground">건</span>
			</p>

			<div className="mt-1.5">
				<CountChange
					count={feedback.count}
					previousCount={feedback.previous_count}
					dayCount={daily.length}
					unit="건"
				/>
			</div>

			<div className="mt-3.5">
				{/*고른 날짜, 없으면 오늘만 진하게 표시*/}
				<DailyCountChart
					daily={daily}
					title="일별 피드백 수"
					seriesName="피드백"
					color="var(--chart-1)"
					unit="건"
					highlightedDate={selectedDate ?? today}
					today={today}
					onSelectDate={handleToggleDate}
				/>
			</div>

			<dl className="mt-3.5 grid grid-cols-2 gap-2">
				<StatCell label="하루 평균">{(feedback.count / daily.length).toFixed(1)}건</StatCell>
				<StatCell label="작성자">{feedback.writer_count.toLocaleString('ko-KR')}명</StatCell>
			</dl>
		</TitledCard>
	);
};

export default FeedbackTrendCard;
