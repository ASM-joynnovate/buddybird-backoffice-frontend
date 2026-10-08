'use client';

import { Pie, PieChart } from 'recharts';

import { ChartContainer, ChartTooltip } from '@/components/ui/chart';

interface Props {
	title: string;
	parts: { name: string; count: number; color: string }[];
	value: string;
	label: string;
	unit: string;
	minAngle?: number;
}

/**
 * 반원 도넛 그래프 컴포넌트
 * @param title 그래프 내용을 설명하는 문구
 * @param parts 그래프의 계열 목록
 * @param value 가운데에 표시할 값
 * @param label 가운데 값의 이름
 * @param unit 툴팁의 개수 뒤에 붙는 단위
 * @param minAngle 작은 계열의 최소 각도
 */
const HalfDonutChart = ({ title, parts, value, label, unit, minAngle }: Props) => {
	return (
		<div className="relative mx-auto mt-1 w-52.5 max-w-full">
			{/*툴팁이 가운데 값 위에 오도록 위에 쌓음*/}
			<ChartContainer config={{}} className="relative z-1 aspect-auto h-26 w-full">
				<PieChart title={title} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
					<Pie
						data={[{ value: 1 }]}
						dataKey="value"
						cy="100%"
						startAngle={180}
						endAngle={0}
						innerRadius={86}
						outerRadius={102}
						cornerRadius={8}
						fill="var(--muted)"
						stroke="none"
						isAnimationActive={false}
					/>
					<Pie
						data={parts.map((part) => ({ ...part, fill: part.color }))}
						dataKey="count"
						nameKey="name"
						cy="100%"
						startAngle={180}
						endAngle={0}
						innerRadius={86}
						outerRadius={102}
						cornerRadius={8}
						paddingAngle={3}
						minAngle={minAngle}
						stroke="none"
						isAnimationActive={false}
					/>
					<ChartTooltip
						cursor={false}
						content={({ active, payload }) => {
							// 배경 반원은 툴팁 없음
							const part = active ? parts.find(({ name }) => name === payload?.[0]?.name) : undefined;

							return part ? (
								<div className="flex items-center gap-1.5 rounded-lg bg-tooltip px-3 py-2 text-xs text-tooltip-foreground shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)]">
									<span className="size-2 rounded-full" style={{ backgroundColor: part.color }} />
									<strong className="text-[13px] font-bold">
										{part.count.toLocaleString('ko-KR')}
										{unit}
									</strong>
									<span className="text-tooltip-foreground/75">{part.name}</span>
								</div>
							) : null;
						}}
					/>
				</PieChart>
			</ChartContainer>

			<p className="pointer-events-none absolute inset-x-0 bottom-0 text-center leading-tight">
				<strong className="block text-[28px] font-bold tracking-tight">{value}</strong>
				<span className="text-[12.5px] text-muted-foreground">{label}</span>
			</p>
		</div>
	);
};

export default HalfDonutChart;
