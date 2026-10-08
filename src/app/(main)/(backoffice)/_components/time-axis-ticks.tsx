import { cn } from '@/lib/utils';

import { type TimeAxisRange, toTimeAxisTicks } from '@/utils/time-axis';

interface Props {
	range: TimeAxisRange;
	now: number;
	className?: string;
}

/**
 * 시간 축의 눈금 글자 컴포넌트
 * @param range 표시할 시각 범위
 * @param now 현재 시각
 * @param className 표시 여부를 정하는 class
 */
const TimeAxisTicks = ({ range, now, className }: Props) => {
	const { ticks, nowPercent } = toTimeAxisTicks(range, now);

	return (
		<div aria-hidden className={cn('relative h-4.5 text-[11.5px] text-muted-foreground tabular-nums', className)}>
			{ticks.map((tick) => (
				<span
					key={tick.percent}
					className="absolute bottom-0 pl-1 whitespace-nowrap"
					style={{ left: `${tick.percent}%` }}
				>
					{tick.label}
				</span>
			))}

			{nowPercent !== null && (
				<b
					className="absolute bottom-0 pl-1 font-bold whitespace-nowrap text-foreground"
					style={{ left: `${nowPercent}%` }}
				>
					지금
				</b>
			)}
		</div>
	);
};

export default TimeAxisTicks;
