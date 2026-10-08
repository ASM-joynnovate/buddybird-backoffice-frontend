import type { CSSProperties } from 'react';

import type { DashboardLive } from '@/types/apis/dashboard';
import type { SessionPhase } from '@/types/apis/sessions';

import { cn } from '@/lib/utils';

import { formatTime, toHoursAndMinutes } from '@/utils/date';

import { Card, CardTitle } from '@/components/ui/card';

const HOURS_PER_DAY = 24;

const phaseConfig = {
	learning: { label: '학습', color: 'var(--chart-1)' },
	rest: { label: '휴식', color: 'var(--chart-2)' },
	stress_care: { label: '스트레스 케어', color: 'var(--chart-3)' },
	sleeping: { label: '수면', color: 'var(--chart-4)' },
} satisfies Record<SessionPhase, { label: string; color: string }>;

interface Props {
	dashboardLive: DashboardLive;
}

/**
 * 실행 중인 세션 카드 컴포넌트
 * @param dashboardLive 대시보드의 현재 상태
 */
const RunningSessionCard = ({ dashboardLive }: Props) => {
	const { running, today } = dashboardLive.sessions;

	const averageDuration =
		running.average_duration_ms === null ? null : toHoursAndMinutes(running.average_duration_ms);
	const maxHourlyCount = Math.max(1, ...today.hourly.map((hourlySession) => hourlySession.count));

	return (
		<Card className="grid gap-0 py-0 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
			{/*현재 개수 및 단계별 개수*/}
			<div className="grid content-between gap-4.5 p-4 md:px-5.5 md:py-5">
				<div className="flex items-baseline justify-between gap-3">
					<CardTitle className="font-bold">실행 중인 세션</CardTitle>
					<p className="text-[13px] text-muted-foreground">{formatTime(dashboardLive.generated_at)} 기준</p>
				</div>

				<div className="grid items-center gap-3.5 md:grid-cols-[auto_minmax(0,1fr)] md:gap-8">
					<p className="text-[56px] leading-none font-bold tracking-[-0.03em] md:text-[68px]">
						{running.count}
						<span className="ml-1 text-xl font-semibold tracking-normal text-muted-foreground">개</span>
					</p>

					<ul aria-label="단계별 세션 수" className="grid grid-cols-2 gap-2">
						{running.phases.map(({ phase, count }) => {
							const percent = running.count ? Math.round((count / running.count) * 100) : 0;

							return (
								<li
									key={phase}
									style={{ '--phase-color': phaseConfig[phase].color } as CSSProperties}
									className="grid gap-0.5 rounded-lg bg-(--phase-color)/9 px-3 pt-2.5 pb-3"
								>
									<span className="flex items-center gap-1.5 text-[13px] font-semibold whitespace-nowrap">
										<span className="size-2 shrink-0 rounded-full bg-(--phase-color)" />
										{phaseConfig[phase].label}
									</span>

									<p className="text-[26px] leading-[1.15] font-bold tracking-tight">
										{count}
										<span className="ml-1.5 text-[13px] font-semibold tracking-normal text-muted-foreground">
											{percent}%
										</span>
									</p>

									<div aria-hidden className="mt-1.5 h-1 rounded-full bg-(--phase-color)/22">
										<div
											className="h-full rounded-full bg-(--phase-color)"
											style={{ width: `${percent}%` }}
										/>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</div>

			{/*오늘의 시작, 종료 및 시간대별 개수*/}
			<div className="grid content-between gap-4 border-t bg-card-inset p-4 md:px-5.5 md:py-5 xl:border-t-0 xl:border-l">
				<div className="flex items-baseline justify-between gap-3">
					<CardTitle className="font-bold">오늘</CardTitle>
					<p className="text-[13px] text-muted-foreground">시간대별 실행 중인 세션</p>
				</div>

				<dl className="flex gap-5 md:gap-7">
					<div>
						<dt className="text-[13px] text-muted-foreground">시작</dt>
						<dd className="text-lg font-bold whitespace-nowrap md:text-xl">
							{today.started_count}
							<span className="ml-0.5 text-[13px] font-semibold text-muted-foreground">회</span>
						</dd>
					</div>

					<div>
						<dt className="text-[13px] text-muted-foreground">종료</dt>
						<dd className="text-lg font-bold whitespace-nowrap md:text-xl">
							{today.ended_count}
							<span className="ml-0.5 text-[13px] font-semibold text-muted-foreground">회</span>
						</dd>
					</div>

					<div>
						<dt className="text-[13px] text-muted-foreground">평균 진행 시간</dt>
						<dd className="text-lg font-bold whitespace-nowrap md:text-xl">
							{averageDuration ? (
								<>
									{averageDuration.hours}
									<span className="mr-1 ml-0.5 text-[13px] font-semibold text-muted-foreground">
										시간
									</span>
									{averageDuration.minutes}
									<span className="ml-0.5 text-[13px] font-semibold text-muted-foreground">분</span>
								</>
							) : (
								'-'
							)}
						</dd>
					</div>
				</dl>

				<div>
					<figure
						aria-label={`오늘 0시부터 ${today.hourly.length - 1}시까지 시간대별 실행 중인 세션 수`}
						className="flex h-21 items-end justify-between"
					>
						{today.hourly.map((hourlySession, index) => (
							<span
								key={hourlySession.start}
								className={cn(
									'w-1.5 rounded-t-full bg-chart-1/38 md:w-2',
									index === today.hourly.length - 1 && 'bg-chart-1',
								)}
								style={{ height: `${(hourlySession.count / maxHourlyCount) * 100}%` }}
							/>
						))}

						{/*아직 지나지 않은 시간*/}
						{Array.from({ length: HOURS_PER_DAY - today.hourly.length }, (_, index) => (
							<span key={index} className="h-1 w-1.5 rounded-full bg-chart-neutral/50 md:w-2" />
						))}
					</figure>

					<ol
						aria-hidden
						className="mt-1.5 flex justify-between text-[11.5px] text-muted-foreground tabular-nums"
					>
						<li>0시</li>
						<li>6시</li>
						<li>12시</li>
						<li>18시</li>
						<li>24시</li>
					</ol>
				</div>
			</div>
		</Card>
	);
};

export default RunningSessionCard;
