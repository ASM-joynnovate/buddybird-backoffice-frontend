import { ArrowDown, ArrowUp } from 'lucide-react';

interface Props {
	count: number;
	previousCount: number;
	dayCount: number;
	unit: string;
}

/**
 * 이전 기간 대비 증감 컴포넌트
 * @param count 조회 기간의 개수
 * @param previousCount 이전 기간의 개수
 * @param dayCount 조회 기간의 일수
 * @param unit 개수 뒤에 붙는 단위
 */
const CountChange = ({ count, previousCount, dayCount, unit }: Props) => {
	if (previousCount === 0) {
		return (
			<p className="text-[13px] text-muted-foreground">
				이전 {dayCount}일 0{unit}
			</p>
		);
	}

	return (
		<p className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted-foreground">
			<span className="inline-flex items-center gap-0.5 rounded-sm bg-muted pr-1.5 pl-0.5 font-bold text-foreground">
				{count >= previousCount ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />}
				{Math.abs(Math.round(((count - previousCount) / previousCount) * 100))}%
			</span>
			이전 {dayCount}일 대비
		</p>
	);
};

export default CountChange;
