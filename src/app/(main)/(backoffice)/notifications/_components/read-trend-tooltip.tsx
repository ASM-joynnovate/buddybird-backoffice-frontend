import type { TooltipContentProps, TooltipValueType } from 'recharts';

interface Props extends Partial<TooltipContentProps<TooltipValueType, number | string>> {
	elapsedHours: number;
}

/**
 * 읽음 추이 그래프의 툴팁 컴포넌트
 * @param active 툴팁 표시 여부
 * @param payload 가리킨 시간의 읽은 사람 수
 * @param label 가리킨 시간
 * @param elapsedHours 발송 뒤 지난 시간
 */
const ReadTrendTooltip = ({ active, payload, label, elapsedHours }: Props) => {
	const hour = Number(label);

	// 아직 지나지 않은 시간은 표시하지 않음
	if (!active || !payload?.length || hour >= elapsedHours) {
		return null;
	}

	return (
		<div className="grid gap-1 rounded-lg bg-tooltip px-3 py-2 text-xs text-tooltip-foreground shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)]">
			<div className="flex items-center gap-1.5">
				<span className="size-2 rounded-full" style={{ backgroundColor: payload[0].color }} />
				<strong className="text-[13px] font-bold tabular-nums">
					{Number(payload[0].value).toLocaleString('ko-KR')}명
				</strong>
				<span className="text-tooltip-foreground/75">읽음</span>
			</div>

			<span className="text-tooltip-foreground/75">
				발송 뒤 {hour}~{hour + 1}시간
			</span>
		</div>
	);
};

export default ReadTrendTooltip;
