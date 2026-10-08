'use client';

import type { UserDashboard } from '@/types/apis/dashboard';

import { Area, AreaChart, Bar, BarChart, ReferenceDot, ReferenceLine, XAxis, YAxis } from 'recharts';

import CountChange from '@/app/(main)/(backoffice)/_components/count-change';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import UserTrendTooltip from '@/app/(main)/(backoffice)/users/_components/user-trend-tooltip';
import { toChartDateLabel } from '@/utils/date';

import { type ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';

const chartConfig = {
	total: { label: '전체', color: 'var(--foreground)' },
	signup: { label: '가입', color: 'var(--chart-1)' },
	withdrawal: { label: '탈퇴', color: 'var(--chart-2)' },
} satisfies ChartConfig;

/** 개수 앞에 부호를 붙이는 함수 */
const toSignedCount = (count: number) => {
	return `${count < 0 ? '−' : '+'}${Math.abs(count).toLocaleString('ko-KR')}`;
};

interface Props {
	userDashboard: UserDashboard;
	today: string;
}

/**
 * 사용자 추이 카드 컴포넌트
 * @param userDashboard 사용자 대시보드 집계
 * @param today 오늘 날짜
 */
const UserTrendCard = ({ userDashboard, today }: Props) => {
	const { users, withdrawals, daily } = userDashboard;

	const changeCount = users.signup_count - withdrawals.count;
	// 지난 날짜는 옅게, 탈퇴는 0 아래로 표시
	const dailyCounts = daily.map((dailyCount) => ({
		date: dailyCount.date,
		total: dailyCount.total_count,
		signup: dailyCount.signup_count,
		withdrawal: -dailyCount.withdrawal_count,
		fillOpacity: dailyCount.date === today ? 1 : 0.42,
	}));
	const lastDailyCount = dailyCounts[dailyCounts.length - 1];
	const totalCounts = dailyCounts.map((dailyCount) => dailyCount.total);

	return (
		<TitledCard
			title="사용자 추이"
			className="xl:col-span-2"
			action=<div className="flex gap-4 text-[13px] text-muted-foreground max-md:hidden">
				{Object.values(chartConfig).map((series) => (
					<span key={series.label} className="inline-flex items-center gap-1.5">
						<span className="size-2 rounded-full" style={{ backgroundColor: series.color }} />
						{series.label}
					</span>
				))}
			</div>
		>
			<div className="grid items-start gap-2 md:grid-cols-[210px_minmax(0,1fr)] md:gap-7">
				<div>
					<p className="text-[44px] leading-[1.1] font-bold tracking-[-0.025em] whitespace-nowrap">
						{users.total_count.toLocaleString('ko-KR')}
						<span className="ml-0.5 text-lg font-semibold tracking-normal text-muted-foreground">명</span>
					</p>

					<div className="mt-1.5 mb-4">
						<CountChange
							count={changeCount}
							previousCount={users.previous_signup_count - withdrawals.previous_count}
							dayCount={daily.length}
							unit="명"
						/>
					</div>

					<dl className="divide-y tabular-nums">
						<div className="flex items-baseline justify-between gap-3 pb-2">
							<dt className="text-muted-foreground">가입</dt>
							<dd className="font-semibold">{toSignedCount(users.signup_count)}명</dd>
						</div>
						<div className="flex items-baseline justify-between gap-3 py-2">
							<dt className="text-muted-foreground">탈퇴</dt>
							<dd className="font-semibold">{toSignedCount(-withdrawals.count)}명</dd>
						</div>
						<div className="flex items-baseline justify-between gap-3 pt-2">
							<dt className="text-muted-foreground">변화</dt>
							<dd className="font-semibold">{toSignedCount(changeCount)}명</dd>
						</div>
					</dl>
				</div>

				{!!lastDailyCount && (
					<div>
						{/*전체 사용자 수의 선*/}
						<ChartContainer config={chartConfig} className="aspect-auto h-30 w-full">
							<AreaChart
								accessibilityLayer
								title="일별 전체 사용자 수"
								syncId="user-trend"
								data={dailyCounts}
								margin={{ top: 20, right: 16, bottom: 4, left: 0 }}
							>
								<defs>
									<linearGradient id="total-fill" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0" stopColor="var(--color-total)" stopOpacity={0.1} />
										<stop offset="1" stopColor="var(--color-total)" stopOpacity={0} />
									</linearGradient>
								</defs>

								<XAxis dataKey="date" hide />
								<YAxis
									width={48}
									tickLine={false}
									axisLine={false}
									domain={['dataMin', 'dataMax']}
									// 값이 모두 같으면 눈금 하나만 표시
									ticks={[...new Set([Math.min(...totalCounts), Math.max(...totalCounts)])]}
									tickFormatter={(count: number) => count.toLocaleString('ko-KR')}
								/>
								<ChartTooltip
									cursor={{ stroke: 'var(--chart-neutral)' }}
									content=<UserTrendTooltip />
								/>
								<Area
									dataKey="total"
									name="전체"
									type="bumpX"
									stroke="var(--color-total)"
									strokeWidth={2.5}
									fill="url(#total-fill)"
									activeDot={{ r: 5, stroke: 'var(--card)', strokeWidth: 2.5 }}
									isAnimationActive={false}
								/>
								<ReferenceDot
									x={lastDailyCount.date}
									y={lastDailyCount.total}
									r={5}
									fill="var(--color-total)"
									stroke="var(--card)"
									strokeWidth={2.5}
								/>
							</AreaChart>
						</ChartContainer>

						{/*날짜별 가입 및 탈퇴 막대*/}
						<ChartContainer config={chartConfig} className="aspect-auto h-36 w-full">
							<BarChart
								accessibilityLayer
								title="일별 가입 및 탈퇴 수"
								syncId="user-trend"
								data={dailyCounts}
								stackOffset="sign"
								margin={{ top: 8, right: 16, bottom: 0, left: 0 }}
							>
								<XAxis
									dataKey="date"
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									interval="equidistantPreserveEnd"
									tickFormatter={(date: string) => toChartDateLabel(date, today)}
								/>
								<YAxis
									width={48}
									tickLine={false}
									axisLine={false}
									allowDecimals={false}
									tickFormatter={(count: number) => (count === 0 ? '0' : toSignedCount(count))}
								/>
								<ChartTooltip cursor={false} content={() => null} />
								<ReferenceLine y={0} stroke="var(--chart-neutral)" />
								<Bar
									dataKey="signup"
									name="가입"
									stackId="count"
									fill="var(--color-signup)"
									radius={[6, 6, 0, 0]}
									maxBarSize={12}
									activeBar={{ fillOpacity: 1 }}
									isAnimationActive={false}
								/>
								<Bar
									dataKey="withdrawal"
									name="탈퇴"
									stackId="count"
									fill="var(--color-withdrawal)"
									radius={[6, 6, 0, 0]}
									maxBarSize={12}
									activeBar={{ fillOpacity: 1 }}
									isAnimationActive={false}
								/>
							</BarChart>
						</ChartContainer>
					</div>
				)}
			</div>
		</TitledCard>
	);
};

export default UserTrendCard;
