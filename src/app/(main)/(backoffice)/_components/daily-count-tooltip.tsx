import dayjs from 'dayjs';
import type { TooltipContentProps, TooltipValueType } from 'recharts';

interface Props extends Partial<TooltipContentProps<TooltipValueType, number | string>> {
	unit: string;
}

/**
 * 일별 개수 그래프의 툴팁 컴포넌트
 * @param active 툴팁 표시 여부
 * @param payload 가리킨 날짜의 계열별 값
 * @param label 가리킨 날짜
 * @param unit 개수 뒤에 붙는 단위
 */
const DailyCountTooltip = ({ active, payload, label, unit }: Props) => {
	if (!active || !payload?.length) {
		return null;
	}

	return (
		<div className="grid gap-1 rounded-lg bg-tooltip px-3 py-2 text-xs text-tooltip-foreground shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)]">
			{payload.map((series) => (
				<div key={series.name} className="flex items-center gap-1.5">
					<span className="size-2 rounded-full" style={{ backgroundColor: series.color }} />
					<strong className="text-[13px] font-bold">
						{series.value}
						{unit}
					</strong>
					<span className="text-tooltip-foreground/75">{series.name}</span>
				</div>
			))}

			<span className="text-tooltip-foreground/75">{dayjs(label).format('M월 D일')}</span>
		</div>
	);
};

export default DailyCountTooltip;
