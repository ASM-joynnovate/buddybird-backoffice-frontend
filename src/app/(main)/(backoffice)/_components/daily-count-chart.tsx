'use client';

import { Bar, BarChart, LabelList, Rectangle, XAxis, YAxis } from 'recharts';

import DailyCountTooltip from '@/app/(main)/(backoffice)/_components/daily-count-tooltip';
import { toChartDateLabel } from '@/utils/date';

import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

const MIN_AXIS_COUNT = 4;

interface Props {
	daily: { date: string; count: number }[];
	title: string;
	seriesName: string;
	color: string;
	unit: string;
	highlightedDate: string;
	today: string;
	onSelectDate?: (date: string) => void;
}

/**
 * 날짜별 개수 막대 그래프 컴포넌트
 * @param daily 날짜별 개수
 * @param title 그래프 내용을 설명하는 문구
 * @param seriesName 툴팁에 표시할 계열 이름
 * @param color 막대의 색
 * @param unit 개수 뒤에 붙는 단위
 * @param highlightedDate 진하게 표시할 날짜
 * @param today 오늘 날짜
 * @param onSelectDate 막대를 누르면 실행할 함수
 */
const DailyCountChart = ({ daily, title, seriesName, color, unit, highlightedDate, today, onSelectDate }: Props) => {
	const dailyCounts = daily.map((dailyCount, index) => ({
		...dailyCount,
		fillOpacity: dailyCount.date === highlightedDate ? 1 : 0.42,
		cursor: onSelectDate && dailyCount.count > 0 ? 'pointer' : undefined,
		lastCount: index === daily.length - 1 ? dailyCount.count : undefined,
	}));
	const maxAxisCount = Math.max(MIN_AXIS_COUNT, ...daily.map((dailyCount) => dailyCount.count));

	const handleSelectDate = (dailyCount: Props['daily'][number]) => {
		if (dailyCount.count === 0) {
			return;
		}

		onSelectDate?.(dailyCount.date);
	};

	return (
		<ChartContainer config={{ count: { label: seriesName, color } }} className="aspect-auto h-38 w-full">
			<BarChart
				accessibilityLayer
				title={title}
				data={dailyCounts}
				margin={{ top: 20, right: 12, bottom: 0, left: 0 }}
			>
				<XAxis
					dataKey="date"
					tickLine={false}
					axisLine={{ stroke: 'var(--border)', strokeOpacity: 0.5 }}
					tickMargin={8}
					interval="equidistantPreserveEnd"
					tickFormatter={(date: string) => toChartDateLabel(date, today)}
				/>
				<YAxis
					width={30}
					tickLine={false}
					axisLine={false}
					domain={[0, maxAxisCount]}
					ticks={[0, maxAxisCount]}
				/>
				<ChartTooltip cursor={false} content=<DailyCountTooltip unit={unit} /> />
				<Bar
					dataKey="count"
					name={seriesName}
					fill="var(--color-count)"
					radius={[7, 7, 0, 0]}
					maxBarSize={14}
					background={{ fill: 'var(--muted)', radius: 7 }}
					activeBar={{ fillOpacity: 1 }}
					isAnimationActive={false}
					// 개수가 0인 날짜에도 배경 막대 표시
					shape=<Rectangle />
					onClick={({ originalDataIndex }) => handleSelectDate(daily[originalDataIndex])}
				>
					<LabelList dataKey="lastCount" position="top" className="fill-foreground text-xs font-bold" />
				</Bar>
			</BarChart>
		</ChartContainer>
	);
};

export default DailyCountChart;
