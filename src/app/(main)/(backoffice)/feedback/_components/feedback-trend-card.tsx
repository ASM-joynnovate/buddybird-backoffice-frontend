'use client';

import { useRouter } from 'next/navigation';

import type { FeedbackDashboard } from '@/types/apis/dashboard';

import type { SearchParamValue } from '@/lib/api';

import { Bar, BarChart, LabelList, Rectangle, XAxis, YAxis } from 'recharts';

import CountChange from '@/app/(main)/(backoffice)/_components/count-change';
import DailyCountTooltip from '@/app/(main)/(backoffice)/_components/daily-count-tooltip';
import StatCell from '@/app/(main)/(backoffice)/_components/stat-cell';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { toChartDateLabel } from '@/utils/date';
import { toToggledQuery } from '@/utils/search-params';

import { type ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';

const MIN_AXIS_COUNT = 4;

const chartConfig = {
	count: { label: '피드백', color: 'var(--chart-1)' },
} satisfies ChartConfig;

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

	// 고른 날짜, 없으면 오늘만 진하게 표시
	const dailyCounts = daily.map((dailyCount, index) => ({
		...dailyCount,
		fillOpacity: dailyCount.date === (selectedDate ?? today) ? 1 : 0.42,
		cursor: dailyCount.count > 0 ? 'pointer' : undefined,
		lastCount: index === daily.length - 1 ? dailyCount.count : undefined,
	}));
	const maxAxisCount = Math.max(MIN_AXIS_COUNT, ...daily.map((dailyCount) => dailyCount.count));

	const handleToggleDate = (dailyCount: FeedbackDashboard['daily'][number]) => {
		if (dailyCount.count === 0) {
			return;
		}

		const searchParams = new URLSearchParams(
			Object.entries(toToggledQuery(query, 'date', dailyCount.date)).map(([name, value]) => [
				name,
				String(value),
			]),
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

			<ChartContainer config={chartConfig} className="mt-3.5 aspect-auto h-38 w-full">
				<BarChart
					accessibilityLayer
					title="일별 피드백 수"
					data={dailyCounts}
					margin={{ top: 20, right: 12, bottom: 0, left: 0 }}
				>
					<XAxis
						dataKey="date"
						tickLine={false}
						axisLine={{ stroke: 'var(--border)', strokeOpacity: 0.5 }}
						tickMargin={8}
						interval="equidistantPreserveEnd"
						tickFormatter={(date: string) => toChartDateLabel(date, today)}
					/>
					<YAxis
						width={30}
						tickLine={false}
						axisLine={false}
						domain={[0, maxAxisCount]}
						ticks={[0, maxAxisCount]}
					/>
					<ChartTooltip cursor={false} content=<DailyCountTooltip unit="건" /> />
					<Bar
						dataKey="count"
						name="피드백"
						fill="var(--color-count)"
						radius={[7, 7, 0, 0]}
						maxBarSize={14}
						background={{ fill: 'var(--muted)', radius: 7 }}
						activeBar={{ fillOpacity: 1 }}
						isAnimationActive={false}
						// 건수가 0인 날짜에도 배경 막대 표시
						shape=<Rectangle />
						onClick={({ originalDataIndex }) => handleToggleDate(daily[originalDataIndex])}
					>
						<LabelList dataKey="lastCount" position="top" className="fill-foreground text-xs font-bold" />
					</Bar>
				</BarChart>
			</ChartContainer>

			<dl className="mt-3.5 grid grid-cols-2 gap-2">
				<StatCell label="하루 평균">{(feedback.count / daily.length).toFixed(1)}건</StatCell>
				<StatCell label="작성자">{feedback.writer_count.toLocaleString('ko-KR')}명</StatCell>
			</dl>
		</TitledCard>
	);
};

export default FeedbackTrendCard;
