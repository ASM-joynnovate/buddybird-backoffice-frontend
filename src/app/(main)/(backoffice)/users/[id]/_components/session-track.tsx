import type { ReactNode } from 'react';

import type { Session } from '@/types/apis/sessions';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';

import { type TimePeriod, toPeriodPercent, toSleepPeriods } from '@/utils/session';

interface Props {
	session: Session;
	sessionPeriod: TimePeriod;
	timeZone: string;
	emergencyPeriods?: TimePeriod[];
	className?: string;
	children?: ReactNode;
}

/**
 * 수면, 연결 끊김 및 응급 상황 구간을 표시한 세션 막대 컴포넌트
 * @param session 표시할 세션
 * @param sessionPeriod 세션의 시작 및 끝 시각
 * @param timeZone 스테이션 기기의 시간대
 * @param emergencyPeriods 응급 상황으로 감지된 구간
 * @param className 막대의 높이를 정하는 class
 * @param children 막대 위에 놓을 이벤트 핀
 */
const SessionTrack = ({ session, sessionPeriod, timeZone, emergencyPeriods, className, children }: Props) => {
	const highlightedPeriods = [
		...toSleepPeriods(session, sessionPeriod, timeZone).map((sleepPeriod) => ({
			...sleepPeriod,
			kind: 'sleep',
			className: 'bg-[color-mix(in_srgb,var(--chart-4)_46%,var(--card))]',
		})),
		...session.disconnections.map((disconnection) => ({
			startMs: dayjs(disconnection.started_at).valueOf(),
			endMs: dayjs(disconnection.ended_at ?? sessionPeriod.endMs).valueOf(),
			kind: 'disconnection',
			className: 'min-w-0.75 bg-destructive-dot',
		})),
		...(emergencyPeriods ?? []).map((emergencyPeriod) => ({
			...emergencyPeriod,
			kind: 'emergency',
			className: 'min-w-0.75 bg-destructive-dot',
		})),
	];

	return (
		<div className={cn('relative h-2.5 min-w-0', className)}>
			<div className="absolute inset-0 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--chart-1)_46%,var(--card))]">
				{highlightedPeriods.map((highlightedPeriod) => {
					const startPercent = toPeriodPercent(highlightedPeriod.startMs, sessionPeriod);

					return (
						<span
							key={`${highlightedPeriod.kind}:${highlightedPeriod.startMs}`}
							className={cn('absolute inset-y-0', highlightedPeriod.className)}
							style={{
								left: `${startPercent}%`,
								width: `${toPeriodPercent(highlightedPeriod.endMs, sessionPeriod) - startPercent}%`,
							}}
						/>
					);
				})}
			</div>

			{/*이벤트 핀이 없으면 응급 상황 감지 시점만 표시*/}
			{children ??
				session.emergency_detections.map((detectedAt) => (
					<span
						key={detectedAt}
						className="absolute top-1/2 size-2.5 -translate-1/2 rounded-full bg-card shadow-[inset_0_0_0_3px_var(--destructive-dot),0_0_0_2px_var(--card)]"
						style={{ left: `${toPeriodPercent(dayjs(detectedAt).valueOf(), sessionPeriod)}%` }}
					/>
				))}

			{session.status === 'running' && (
				<span className="absolute top-1/2 -right-0.5 size-2 -translate-y-1/2 rounded-full bg-chart-1">
					<span className="absolute inset-0 animate-ping rounded-full bg-chart-1 motion-reduce:hidden" />
				</span>
			)}
		</div>
	);
};

export default SessionTrack;
