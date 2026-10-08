'use client';

import type { CSSProperties } from 'react';

import { useGetUser, useGetUserSessionList } from '@/hooks/apis/users';
import { useNow } from '@/hooks/use-now';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { PHASE_CYCLE } from '@/config';
import { SESSION_ENDED_REASONS, SESSION_PHASES } from '@/config/session';
import { MINUTE } from '@/config/units';
import { formatDateTime, formatRelativeTime, toHoursAndMinutes } from '@/utils/date';

import { Card, CardTitle } from '@/components/ui/card';

const unitClassName = 'text-lg font-semibold tracking-normal text-muted-foreground';

interface Props {
	id: string;
	initialNow: number;
}

/**
 * 현재 세션 카드 컴포넌트
 * @param id 조회할 사용자 ID
 * @param initialNow 서버가 화면을 그린 시각
 */
const CurrentSessionCard = ({ id, initialNow }: Props) => {
	const { data: userData } = useGetUser({ id });

	const { data: userSessionListData } = useGetUserSessionList({ id, page: 1 });

	const now = useNow(initialNow);

	const [lastSession] = userSessionListData.data;

	if (lastSession?.status !== 'running') {
		const endedReason = lastSession?.period.ended_reason;

		return (
			<TitledCard title="현재 세션">
				<strong className="text-xl font-bold tracking-tight">
					{lastSession ? '실행 중인 세션이 없습니다' : '아직 세션을 시작하지 않았습니다'}
				</strong>
				<p className="mt-1 text-muted-foreground">
					{lastSession?.period.ended_at
						? `마지막 세션은 ${formatDateTime(lastSession.period.ended_at)}에 ${endedReason ? SESSION_ENDED_REASONS[endedReason].sentence : '끝났습니다.'}`
						: '가입한 뒤 세션 기록이 없습니다.'}
				</p>
			</TitledCard>
		);
	}

	const { schedule, progress, period } = lastSession;
	const duration = toHoursAndMinutes(Math.max(0, now - dayjs(period.started_at).valueOf()));
	const phaseElapsedMs = progress.phase_started_at ? now - dayjs(progress.phase_started_at).valueOf() : 0;
	const station = userData.devices.find((device) => device.id === lastSession.station.device_id);

	const sessionInfos = [
		{ label: '단어', value: lastSession.word.name },
		{ label: '예정 종료', value: schedule.ends_at ? formatDateTime(schedule.ends_at) : '끝낼 때까지' },
		{
			label: '수면 시간',
			value: schedule.sleep
				? `${schedule.sleep.sleep_at.slice(0, 5)} ~ ${schedule.sleep.wake_at.slice(0, 5)}`
				: '-',
		},
		{ label: '스테이션', value: station?.client.model ?? '-' },
	];

	return (
		<Card className="grid gap-0 py-0 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
			{/*진행 시간 및 오디오 사이클의 현재 단계*/}
			<div className="grid content-between gap-4.5 p-4 md:px-5.5 md:py-5">
				<div className="flex items-baseline justify-between gap-3">
					<CardTitle className="font-bold">현재 세션</CardTitle>
					<p className="text-[13px] text-muted-foreground">
						마지막 신호{' '}
						{progress.last_heartbeat_at ? formatRelativeTime(progress.last_heartbeat_at, now) : '없음'}
					</p>
				</div>

				<div>
					<p className="text-[44px] leading-[1.1] font-bold tracking-[-0.025em] whitespace-nowrap">
						{duration.hours}
						<span className={`mr-2 ml-0.5 ${unitClassName}`}>시간</span>
						{duration.minutes}
						<span className={`ml-0.5 ${unitClassName}`}>분</span>
					</p>
					<p className="mt-1 text-[13px] text-muted-foreground">{formatDateTime(period.started_at)} 시작</p>
				</div>

				<ul
					aria-label="20분 오디오 사이클"
					className="grid gap-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.4fr)]"
				>
					{PHASE_CYCLE.map(({ phase, durationMs }) => {
						const current = progress.current_phase === phase;

						return (
							<li
								key={phase}
								aria-current={current ? 'true' : undefined}
								style={{ '--phase-color': SESSION_PHASES[phase].color } as CSSProperties}
								className="grid min-w-0 gap-0.5 rounded-lg bg-(--phase-color)/9 px-3 pt-2.5 pb-3"
							>
								<span className="flex items-center gap-1.5 text-[13px] font-semibold whitespace-nowrap">
									<span className="size-2 shrink-0 rounded-full bg-(--phase-color)" />
									{SESSION_PHASES[phase].label}
									{current && (
										<span className="ml-auto text-xs font-medium text-muted-foreground">
											{Math.floor(phaseElapsedMs / MINUTE)}분 지남
										</span>
									)}
								</span>

								<p
									className={cn(
										'text-[26px] leading-[1.15] font-bold tracking-tight',
										!current && 'text-muted-foreground',
									)}
								>
									{durationMs / MINUTE}
									<span className="ml-0.5 text-[13px] font-semibold tracking-normal text-muted-foreground">
										분
									</span>
								</p>

								<div aria-hidden className="mt-1.5 h-1 rounded-full bg-(--phase-color)/22">
									<div
										className="h-full rounded-full bg-(--phase-color)"
										style={{
											width: current
												? `${Math.min(100, (phaseElapsedMs / durationMs) * 100)}%`
												: 0,
										}}
									/>
								</div>
							</li>
						);
					})}
				</ul>
			</div>

			{/*세션의 단어, 예정 종료, 수면 시간, 스테이션*/}
			<div className="grid content-start gap-4 border-t bg-card-inset p-4 md:px-5.5 md:py-5 xl:border-t-0 xl:border-l">
				<CardTitle className="font-bold">세션 정보</CardTitle>

				<dl className="divide-y">
					{sessionInfos.map((sessionInfo) => (
						<div
							key={sessionInfo.label}
							className="flex items-baseline justify-between gap-3 py-2 first:pt-0 last:pb-0"
						>
							<dt className="text-muted-foreground">{sessionInfo.label}</dt>
							<dd className="text-right font-semibold tabular-nums">{sessionInfo.value}</dd>
						</div>
					))}
				</dl>
			</div>
		</Card>
	);
};

export default CurrentSessionCard;
