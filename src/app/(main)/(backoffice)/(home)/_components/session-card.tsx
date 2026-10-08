'use client';

import type { Dashboard } from '@/types/apis/dashboard';

import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';

import DailyCountTooltip from '@/app/(main)/(backoffice)/_components/daily-count-tooltip';
import StatCell from '@/app/(main)/(backoffice)/_components/stat-cell';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { HOUR } from '@/config/units';
import { toChartDateLabel, toHoursAndMinutes } from '@/utils/date';

import { type ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';

const chartConfig = {
	count: { label: '세션', color: 'var(--chart-1)' },
} satisfies ChartConfig;

interface Props {
	sessions: Dashboard['sessions'];
	today: string;
}

/**
 * 세션 카드 컴포넌트
 * @param sessions 조회 기간의 세션 집계
 * @param today 오늘 날짜
 */
const SessionCard = ({ sessions, today }: Props) => {
	const averageDuration =
		sessions.average_duration_ms === null ? null : toHoursAndMinutes(sessions.average_duration_ms);
	// 지난 날짜는 옅게, 마지막 날짜에만 값 표시
	const dailySessions = sessions.daily.map((dailySession, index) => ({
		...dailySession,
		fillOpacity: dailySession.date === today ? 1 : 0.42,
		lastCount: index === sessions.daily.length - 1 ? dailySession.count : undefined,
	}));

	return (
		<TitledCard title="세션">
			<dl className="mb-4.5 grid grid-cols-3 gap-2">
				<StatCell label="하루 평균">{(sessions.count / sessions.daily.length).toFixed(1)}회</StatCell>
				<StatCell label="시간 합계">
					{Math.round(sessions.duration_ms / HOUR).toLocaleString('ko-KR')}시간
				</StatCell>
				<StatCell label="평균 시간">
					{averageDuration ? `${averageDuration.hours}시간 ${averageDuration.minutes}분` : '-'}
				</StatCell>
			</dl>

			<ChartContainer config={chartConfig} className="aspect-auto h-65 w-full">
				<BarChart
					accessibilityLayer
					title="일별 세션 수"
					data={dailySessions}
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
					<YAxis width={30} tickLine={false} axisLine={false} allowDecimals={false} />
					<ChartTooltip cursor={false} content=<DailyCountTooltip unit="회" /> />
					<Bar
						dataKey="count"
						name="세션"
						fill="var(--color-count)"
						radius={[7, 7, 0, 0]}
						maxBarSize={14}
						background={{ fill: 'var(--muted)', radius: 7 }}
						activeBar={{ fillOpacity: 1 }}
						isAnimationActive={false}
					>
						<LabelList dataKey="lastCount" position="top" className="fill-foreground text-xs font-bold" />
					</Bar>
				</BarChart>
			</ChartContainer>
		</TitledCard>
	);
};

export default SessionCard;
