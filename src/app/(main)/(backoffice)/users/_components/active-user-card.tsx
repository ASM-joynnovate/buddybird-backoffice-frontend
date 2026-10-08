'use client';

import type { UserDashboard } from '@/types/apis/dashboard';

import { Area, AreaChart, CartesianGrid, ReferenceDot, XAxis, YAxis } from 'recharts';

import DailyCountTooltip from '@/app/(main)/(backoffice)/_components/daily-count-tooltip';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { toChartDateLabel } from '@/utils/date';

import { type ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';

const chartConfig = {
	running_user_count: { label: '활성 사용자', color: 'var(--chart-1)' },
} satisfies ChartConfig;

interface Props {
	daily: UserDashboard['daily'];
	today: string;
}

/**
 * 활성 사용자 카드 컴포넌트
 * @param daily 날짜별 사용자 집계
 * @param today 오늘 날짜
 */
const ActiveUserCard = ({ daily, today }: Props) => {
	const lastDailyCount = daily[daily.length - 1];

	return (
		<TitledCard
			title="활성 사용자"
			action=<span className="text-[13px] text-muted-foreground">세션 실행 기준</span>
		>
			<ChartContainer config={chartConfig} className="aspect-auto h-65 w-full">
				<AreaChart
					accessibilityLayer
					title="일별 활성 사용자 수"
					data={daily}
					margin={{ top: 24, right: 16, bottom: 0, left: 0 }}
				>
					<defs>
						<linearGradient id="active-fill" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor="var(--color-running_user_count)" stopOpacity={0.26} />
							<stop offset="1" stopColor="var(--color-running_user_count)" stopOpacity={0} />
						</linearGradient>
					</defs>

					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="date"
						tickLine={false}
						axisLine={false}
						tickMargin={8}
						interval="equidistantPreserveEnd"
						tickFormatter={(date: string) => toChartDateLabel(date, today)}
					/>
					<YAxis width={36} tickLine={false} axisLine={false} allowDecimals={false} />
					<ChartTooltip cursor={{ stroke: 'var(--chart-neutral)' }} content=<DailyCountTooltip unit="명" /> />
					<Area
						dataKey="running_user_count"
						name="활성 사용자"
						type="bumpX"
						stroke="var(--color-running_user_count)"
						strokeWidth={2.5}
						fill="url(#active-fill)"
						activeDot={{ r: 5, stroke: 'var(--card)', strokeWidth: 2.5 }}
						isAnimationActive={false}
					/>

					{/*마지막 날짜의 값 및 점*/}
					{!!lastDailyCount && (
						<ReferenceDot
							x={lastDailyCount.date}
							y={lastDailyCount.running_user_count}
							r={5}
							fill="var(--color-running_user_count)"
							stroke="var(--card)"
							strokeWidth={2.5}
							label={{
								value: `${lastDailyCount.running_user_count}명`,
								position: 'top',
								className: 'fill-foreground text-xs font-bold',
							}}
						/>
					)}
				</AreaChart>
			</ChartContainer>
		</TitledCard>
	);
};

export default ActiveUserCard;
