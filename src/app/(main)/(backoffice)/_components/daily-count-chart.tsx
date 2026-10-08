'use client';

import { Bar, BarChart, BarStack, LabelList, Rectangle, XAxis, YAxis } from 'recharts';

import DailyCountTooltip from '@/app/(main)/(backoffice)/_components/daily-count-tooltip';
import { toChartDateLabel } from '@/utils/date';

import { type ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';

const MIN_AXIS_COUNT = 4;

interface Props {
	daily: ({ date: string } & Record<string, string | number>)[];
	title: string;
	series: { dataKey: string; name: string; color: string }[];
	unit: string;
	highlightedDate: string;
	today: string;
	onSelectDate?: (date: string) => void;
}

/**
 * 날짜별 개수 막대 그래프 컴포넌트
 * @param daily 날짜별 개수
 * @param title 그래프 내용을 설명하는 문구
 * @param series 아래부터 쌓을 계열의 이름 및 색
 * @param unit 개수 뒤에 붙는 단위
 * @param highlightedDate 진하게 표시할 날짜
 * @param today 오늘 날짜
 * @param onSelectDate 막대를 누르면 실행할 함수
 */
const DailyCountChart = ({ daily, title, series, unit, highlightedDate, today, onSelectDate }: Props) => {
	const chartConfig: ChartConfig = Object.fromEntries(
		series.map(({ dataKey, name, color }) => [dataKey, { label: name, color }]),
	);

	const dailyCounts = daily.map((dailyCount, index) => {
		const totalCount = series.reduce((sum, { dataKey }) => sum + Number(dailyCount[dataKey]), 0);

		return {
			...dailyCount,
			totalCount,
			fillOpacity: dailyCount.date === highlightedDate ? 1 : 0.42,
			cursor: onSelectDate && totalCount > 0 ? 'pointer' : undefined,
			lastCount: index === daily.length - 1 ? totalCount : undefined,
		};
	});
	const maxAxisCount = Math.max(MIN_AXIS_COUNT, ...dailyCounts.map((dailyCount) => dailyCount.totalCount));

	const handleSelectDate = (dailyCount: (typeof dailyCounts)[number]) => {
		if (dailyCount.totalCount === 0) {
			return;
		}

		onSelectDate?.(dailyCount.date);
	};

	return (
		<ChartContainer config={chartConfig} className="aspect-auto h-38 w-full">
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
				<ChartTooltip
					cursor={false}
					content={({ payload, ...tooltipProps }) => (
						<DailyCountTooltip
							{...tooltipProps}
							// 계열이 여럿이면 0건인 계열 제외
							payload={series.length > 1 ? payload.filter((item) => item.value !== 0) : payload}
							unit={unit}
						/>
					)}
				/>

				{/*쌓은 막대 전체의 위쪽 끝만 둥글게 표시*/}
				<BarStack radius={[7, 7, 0, 0]}>
					{series.map(({ dataKey, name }, index) => (
						<Bar
							key={dataKey}
							dataKey={dataKey}
							name={name}
							fill={`var(--color-${dataKey})`}
							maxBarSize={14}
							background={index === 0 ? { fill: 'var(--muted)', radius: 7 } : undefined}
							activeBar={{ fillOpacity: 1 }}
							isAnimationActive={false}
							// 개수가 0인 날짜에도 배경 막대 표시
							shape=<Rectangle />
							onClick={({ originalDataIndex }) => handleSelectDate(dailyCounts[originalDataIndex])}
						>
							{index === series.length - 1 && (
								<LabelList
									dataKey="lastCount"
									position="top"
									className="fill-foreground text-xs font-bold"
								/>
							)}
						</Bar>
					))}
				</BarStack>
			</BarChart>
		</ChartContainer>
	);
};

export default DailyCountChart;
