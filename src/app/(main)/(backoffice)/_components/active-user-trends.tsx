'use client';

import { useId } from 'react';

import type { UserDashboard } from '@/types/apis/dashboard';

import { Area, AreaChart, CartesianGrid, ReferenceDot, XAxis, YAxis } from 'recharts';

import DailyCountTooltip from '@/app/(main)/(backoffice)/_components/daily-count-tooltip';
import { ACTIVE_USER_RECORD_START_DATE } from '@/config';
import { toChartDateLabel } from '@/utils/date';

import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

// recordDayCount는 접속 기록을 합치는 일수
const ACTIVE_USER_METRICS = {
	dau: { label: 'DAU', color: 'var(--chart-2)', recordDayCount: 1 },
	wau: { label: 'WAU', color: 'var(--chart-3)', recordDayCount: 7 },
	mau: { label: 'MAU', color: 'var(--chart-4)', recordDayCount: 28 },
	running_user_count: { label: '세션', color: 'var(--chart-1)', recordDayCount: null },
};

export type ActiveUserMetric = keyof typeof ACTIVE_USER_METRICS;

interface Props {
	daily: UserDashboard['daily'];
	metrics: ActiveUserMetric[];
	chartHeight: number;
	today: string;
}

/**
 * 기준마다 오늘 값 및 일별 그래프를 한 줄씩 표시하는 컴포넌트
 * @param daily 날짜별 사용자 집계
 * @param metrics 표시할 활성 사용자 기준
 * @param chartHeight 그래프 한 줄의 높이
 * @param today 오늘 날짜
 */
const ActiveUserTrends = ({ daily, metrics, chartHeight, today }: Props) => {
	// url(#id)에 넣을 수 있도록 콜론 제거
	const gradientIdPrefix = useId().replace(/:/g, '');

	return (
		<dl className="grid divide-y">
			{metrics.map((metric) => {
				const { label, color, recordDayCount } = ACTIVE_USER_METRICS[metric];
				const gradientId = `${gradientIdPrefix}${metric}`;

				// 접속 기록이 없는 날짜는 값 없이 표시
				const dailyCounts = daily.map((dailyCount) => ({
					date: dailyCount.date,
					count:
						recordDayCount !== null && dailyCount.date < ACTIVE_USER_RECORD_START_DATE
							? null
							: dailyCount[metric],
				}));
				const lastDailyCount = dailyCounts.at(-1);

				return (
					<div
						key={metric}
						className="grid items-center gap-1 py-2.5 first:pt-0 last:pb-0 md:grid-cols-[132px_minmax(0,1fr)] md:gap-4"
					>
						<div>
							<dt className="flex items-center gap-1.5 text-[13px] font-semibold">
								<span className="size-2 rounded-full" style={{ backgroundColor: color }} />
								{label}
							</dt>
							<dd>
								<strong className="text-[26px] leading-[1.15] font-bold tracking-[-0.02em] tabular-nums">
									{lastDailyCount?.count?.toLocaleString('ko-KR') ?? '-'}
									{typeof lastDailyCount?.count === 'number' && (
										<span className="ml-0.5 text-[13px] font-semibold tracking-normal text-muted-foreground">
											명
										</span>
									)}
								</strong>

								{recordDayCount !== null && (
									<span className="block text-[12.5px] text-muted-foreground">
										{recordDayCount}일
									</span>
								)}
							</dd>
						</div>

						<ChartContainer
							config={{ count: { label, color } }}
							className="aspect-auto w-full"
							style={{ height: chartHeight }}
						>
							<AreaChart
								accessibilityLayer
								title={`일별 ${label}`}
								data={dailyCounts}
								margin={{ top: 24, right: 16, bottom: 0, left: 0 }}
							>
								<defs>
									<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
										<stop offset="0" stopColor="var(--color-count)" stopOpacity={0.26} />
										<stop offset="1" stopColor="var(--color-count)" stopOpacity={0} />
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
								<YAxis
									width={40}
									tickCount={3}
									tickLine={false}
									axisLine={false}
									allowDecimals={false}
								/>
								<ChartTooltip
									cursor={{ stroke: 'var(--chart-neutral)' }}
									content=<DailyCountTooltip unit="명" />
								/>

								<Area
									dataKey="count"
									name={label}
									type="bumpX"
									stroke="var(--color-count)"
									strokeWidth={2.5}
									fill={`url(#${gradientId})`}
									activeDot={{ r: 5, stroke: 'var(--card)', strokeWidth: 2.5 }}
									isAnimationActive={false}
								/>

								{/*마지막 날짜의 점*/}
								{typeof lastDailyCount?.count === 'number' && (
									<ReferenceDot
										x={lastDailyCount.date}
										y={lastDailyCount.count}
										r={5}
										fill="var(--color-count)"
										stroke="var(--card)"
										strokeWidth={2.5}
									/>
								)}
							</AreaChart>
						</ChartContainer>
					</div>
				);
			})}
		</dl>
	);
};

export default ActiveUserTrends;
