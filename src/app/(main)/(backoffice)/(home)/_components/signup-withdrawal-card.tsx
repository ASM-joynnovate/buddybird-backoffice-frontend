'use client';

import type { Dashboard } from '@/types/apis/dashboard';

import { Area, AreaChart, CartesianGrid, ReferenceDot, XAxis, YAxis } from 'recharts';

import DailyCountTooltip from '@/app/(main)/(backoffice)/_components/daily-count-tooltip';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { toChartDateLabel } from '@/utils/date';

import { type ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';

const chartConfig = {
	signup: { label: '가입', color: 'var(--chart-1)' },
	withdrawal: { label: '탈퇴', color: 'var(--chart-2)' },
} satisfies ChartConfig;

interface Props {
	users: Dashboard['users'];
	withdrawals: Dashboard['withdrawals'];
	today: string;
}

/**
 * 가입 및 탈퇴 카드 컴포넌트
 * @param users 조회 기간의 사용자 집계
 * @param withdrawals 조회 기간의 탈퇴 집계
 * @param today 오늘 날짜
 */
const SignupWithdrawalCard = ({ users, withdrawals, today }: Props) => {
	const dailyCounts = users.daily_signups.map((dailySignup, index) => ({
		date: dailySignup.date,
		signup: dailySignup.count,
		withdrawal: withdrawals.daily[index].count,
	}));
	const lastDailyCount = dailyCounts[dailyCounts.length - 1];

	return (
		<TitledCard
			title="가입 및 탈퇴"
			action=<div className="flex gap-4 text-[13px] text-muted-foreground max-md:hidden">
				<span className="inline-flex items-center gap-1.5">
					<span className="size-2 rounded-full bg-chart-1" />
					가입
					<strong className="font-bold text-foreground">
						{users.signup_count.toLocaleString('ko-KR')}명
					</strong>
				</span>
				<span className="inline-flex items-center gap-1.5">
					<span className="size-2 rounded-full bg-chart-2" />
					탈퇴
					<strong className="font-bold text-foreground">{withdrawals.count.toLocaleString('ko-KR')}명</strong>
				</span>
			</div>
		>
			<ChartContainer config={chartConfig} className="aspect-auto h-55 w-full">
				<AreaChart
					accessibilityLayer
					title="일별 가입 및 탈퇴 수"
					data={dailyCounts}
					margin={{ top: 20, right: 16, bottom: 0, left: 0 }}
				>
					<defs>
						<linearGradient id="signup-fill" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor="var(--color-signup)" stopOpacity={0.26} />
							<stop offset="1" stopColor="var(--color-signup)" stopOpacity={0} />
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
					<YAxis width={30} tickLine={false} axisLine={false} allowDecimals={false} />
					<ChartTooltip cursor={{ stroke: 'var(--chart-neutral)' }} content=<DailyCountTooltip unit="명" /> />
					<Area
						dataKey="signup"
						name="가입"
						type="bumpX"
						stroke="var(--color-signup)"
						strokeWidth={2.5}
						fill="url(#signup-fill)"
						activeDot={{ r: 5, stroke: 'var(--card)', strokeWidth: 2.5 }}
						isAnimationActive={false}
					/>
					<Area
						dataKey="withdrawal"
						name="탈퇴"
						type="bumpX"
						stroke="var(--color-withdrawal)"
						strokeWidth={2.5}
						fillOpacity={0}
						activeDot={{ r: 5, stroke: 'var(--card)', strokeWidth: 2.5 }}
						isAnimationActive={false}
					/>

					{/*마지막 날짜의 값 및 점*/}
					<ReferenceDot
						x={lastDailyCount.date}
						y={lastDailyCount.signup}
						r={5}
						fill="var(--color-signup)"
						stroke="var(--card)"
						strokeWidth={2.5}
						label={{
							value: lastDailyCount.signup,
							position: 'top',
							className: 'fill-foreground text-xs font-bold',
						}}
					/>
					<ReferenceDot
						x={lastDailyCount.date}
						y={lastDailyCount.withdrawal}
						r={5}
						fill="var(--color-withdrawal)"
						stroke="var(--card)"
						strokeWidth={2.5}
						label={{
							value: lastDailyCount.withdrawal,
							position: 'top',
							className: 'fill-foreground text-xs font-bold',
						}}
					/>
				</AreaChart>
			</ChartContainer>
		</TitledCard>
	);
};

export default SignupWithdrawalCard;
