import type { EmergencyDashboard } from '@/types/apis/dashboard';

import { cn } from '@/lib/utils';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';

interface Props {
	hourly: EmergencyDashboard['hourly'];
}

/**
 * 시간대별 응급 상황 수 카드 컴포넌트
 * @param hourly 0시부터 23시까지의 응급 상황 수
 */
const EmergencyHourCard = ({ hourly }: Props) => {
	const maxHourlyCount = Math.max(1, ...hourly.map((hourlyCount) => hourlyCount.count));

	return (
		<TitledCard title="시간대">
			<figure aria-label="시간대별 응급 상황 수" className="flex h-16 items-end justify-between border-b">
				{hourly.map((hourlyCount) => (
					<span
						key={hourlyCount.hour}
						className={cn(
							'min-h-1 w-1.5 rounded-t-full bg-foreground/42 md:w-2',
							// 가장 많은 시간대만 진하게 표시
							hourlyCount.count === maxHourlyCount && 'bg-foreground',
							hourlyCount.count === 0 && 'bg-chart-neutral/50',
						)}
						style={{ height: `${(hourlyCount.count / maxHourlyCount) * 100}%` }}
					/>
				))}
			</figure>

			<p aria-hidden className="mt-1.5 flex justify-between text-[11.5px] text-muted-foreground tabular-nums">
				<span>0시</span>
				<span>6시</span>
				<span>12시</span>
				<span>18시</span>
				<span>24시</span>
			</p>
		</TitledCard>
	);
};

export default EmergencyHourCard;
