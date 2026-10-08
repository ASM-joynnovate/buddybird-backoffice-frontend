'use client';

import { Pie, PieChart } from 'recharts';

import { ChartContainer } from '@/components/ui/chart';

interface Props {
	title: string;
	parts: { name: string; count: number; color: string }[];
	value: string;
	label: string;
	minAngle?: number;
}

/**
 * 반원 도넛 그래프 컴포넌트
 * @param title 그래프 내용을 설명하는 문구
 * @param parts 그래프의 계열 목록
 * @param value 가운데에 표시할 값
 * @param label 가운데 값의 이름
 * @param minAngle 작은 계열의 최소 각도
 */
const HalfDonutChart = ({ title, parts, value, label, minAngle }: Props) => {
	return (
		<div className="relative mx-auto mt-1 w-52.5 max-w-full">
			<ChartContainer config={{}} className="aspect-auto h-26 w-full">
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
				</PieChart>
			</ChartContainer>

			<p className="absolute inset-x-0 bottom-0 text-center leading-tight">
				<strong className="block text-[28px] font-bold tracking-tight">{value}</strong>
				<span className="text-[12.5px] text-muted-foreground">{label}</span>
			</p>
		</div>
	);
};

export default HalfDonutChart;
