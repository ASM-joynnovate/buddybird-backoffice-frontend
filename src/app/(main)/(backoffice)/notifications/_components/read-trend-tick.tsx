'use client';

import { useChartWidth } from 'recharts';

const NARROW_CHART_WIDTH = 520;
const NARROW_TICK_HOURS = 12;

interface Props {
	x?: number;
	y?: number;
	payload?: { value: number };
}

/**
 * 읽음 추이 그래프의 가로 눈금 글자 컴포넌트
 * @param x 눈금의 가로 위치
 * @param y 눈금의 세로 위치
 * @param payload 눈금의 발송 뒤 지난 시간
 */
const ReadTrendTick = ({ x, y, payload }: Props) => {
	const chartWidth = useChartWidth() ?? 0;

	// 좁은 그래프는 12시간마다 표시
	if (!payload || (chartWidth <= NARROW_CHART_WIDTH && payload.value % NARROW_TICK_HOURS !== 0)) {
		return null;
	}

	return (
		<text x={x} y={y} dy={12} textAnchor="middle" className="fill-muted-foreground text-[11.5px] tabular-nums">
			{payload.value === 0 ? '발송' : `${payload.value}시간`}
		</text>
	);
};

export default ReadTrendTick;
