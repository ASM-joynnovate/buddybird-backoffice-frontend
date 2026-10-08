import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';

import { HOUR } from '@/config/units';
import { formatShortDateTime } from '@/utils/date';
import { type TimeAxisRange, toTimeAxisPercent, toTimeAxisSteps } from '@/utils/time-axis';

const RULE_STEP_MS = 6 * HOUR;
const BAR_MAX_HEIGHT = 36;
const BAR_MIN_HEIGHT = 6;

interface Props {
	bars: { sent_at: string; count: number }[];
	range: TimeAxisRange;
	now: number;
	color: string;
}

/**
 * 한국 시간 위에 시각별 인원을 막대로 그리는 시간 축 컴포넌트
 * @param bars 시각별 인원
 * @param range 표시할 시각 범위
 * @param now 현재 시각
 * @param color 막대의 색
 */
const TimeAxis = ({ bars, range, now, color }: Props) => {
	const peakCount = Math.max(...bars.map((bar) => bar.count));
	const nowPercent = toTimeAxisPercent(now, range);
	const barLabels = bars.map((bar) => `${formatShortDateTime(bar.sent_at)} ${bar.count.toLocaleString('ko-KR')}명`);

	return (
		<figure
			aria-label={`한국 시간 기준 발송 시각: ${barLabels.join(', ')}`}
			className="relative h-16 border-b [background:repeating-linear-gradient(to_right,color-mix(in_srgb,var(--border)_55%,transparent)_0_1px,transparent_1px_var(--hour-width))]"
			style={
				{
					'--hour-width': `${(HOUR / (range.to - range.from)) * 100}%`,
					'--bar-color': color,
				} as CSSProperties
			}
		>
			{/*6시간마다 진한 세로선*/}
			{toTimeAxisSteps(range, RULE_STEP_MS).map((time) => (
				<span
					key={time}
					className="absolute inset-y-0 border-l border-chart-neutral"
					style={{ left: `${toTimeAxisPercent(time, range)}%` }}
				/>
			))}

			{bars.map((bar, index) => {
				const sentAt = dayjs(bar.sent_at).valueOf();
				const hourPercent = toTimeAxisPercent(Math.floor(sentAt / HOUR) * HOUR, range);

				return (
					<span
						key={bar.sent_at}
						className={cn(
							// 마우스를 올리는 영역을 위로 넓힘
							"group absolute bottom-0 z-1 w-[clamp(3px,calc(var(--hour-width)-2px),14px)] -translate-x-1/2 rounded-t-full before:absolute before:-inset-x-1 before:-top-7 before:bottom-0 before:content-[''] [&:hover]:z-4",
							sentAt <= now
								? 'bg-(--bar-color)'
								: 'bg-[color-mix(in_srgb,var(--bar-color)_45%,var(--card))]',
						)}
						style={{
							left: `calc(${hourPercent}% + var(--hour-width) / 2)`,
							height: Math.max(
								BAR_MIN_HEIGHT,
								Math.round(Math.sqrt(bar.count / peakCount) * BAR_MAX_HEIGHT),
							),
						}}
					>
						{bar.count === peakCount && (
							<b className="absolute bottom-[calc(100%+4px)] left-1/2 -translate-x-1/2 text-xs font-bold whitespace-nowrap tabular-nums">
								{bar.count.toLocaleString('ko-KR')}명
							</b>
						)}

						{/*터치 기기에서도 누르면 표시*/}
						<span className="pointer-events-none invisible absolute bottom-[calc(100%+8px)] left-1/2 z-3 -translate-x-1/2 rounded-lg bg-tooltip px-3 py-2 text-xs font-semibold whitespace-nowrap text-tooltip-foreground tabular-nums shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)] group-[:hover]:visible">
							{barLabels[index]}
						</span>
					</span>
				);
			})}

			{nowPercent >= 0 && nowPercent <= 100 && (
				<span
					className="absolute -top-1.5 bottom-0 border-l border-foreground"
					style={{ left: `${nowPercent}%` }}
				/>
			)}
		</figure>
	);
};

export default TimeAxis;
