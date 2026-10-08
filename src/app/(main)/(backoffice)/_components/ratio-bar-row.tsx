import { cn } from '@/lib/utils';

interface Props {
	label: string;
	barPercent: number;
	percent: number;
	barClassName?: string;
	className: string;
}

/**
 * 이름, 비율 막대, 비율을 한 줄에 두는 행 컴포넌트
 * @param label 값의 이름
 * @param barPercent 막대를 채울 비율
 * @param percent 오른쪽 끝에 표시할 비율
 * @param barClassName 막대의 색 class
 * @param className 행에 더할 class
 */
const RatioBarRow = ({ label, barPercent, percent, barClassName, className }: Props) => {
	return (
		<li className={cn('grid items-center', className)}>
			<span className="truncate">{label}</span>

			<div aria-hidden className="h-2 rounded-full bg-muted">
				<div
					className={cn('h-full rounded-full bg-chart-2', barClassName)}
					style={{ width: `${barPercent}%` }}
				/>
			</div>

			<strong className="text-right font-bold tabular-nums">{percent}%</strong>
		</li>
	);
};

export default RatioBarRow;
