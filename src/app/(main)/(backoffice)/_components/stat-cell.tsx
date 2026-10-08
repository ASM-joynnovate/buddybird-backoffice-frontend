import type { ReactNode } from 'react';

interface Props {
	label: string;
	children: ReactNode;
}

/**
 * 이름 및 값 하나를 담는 숫자 칸 컴포넌트
 * @param label 값의 이름
 * @param children 표시할 값
 */
const StatCell = ({ label, children }: Props) => {
	return (
		<div className="rounded-lg bg-muted px-3.5 py-2.5">
			<dt className="text-[12.5px] text-muted-foreground">{label}</dt>
			<dd className="text-lg font-bold tracking-tight tabular-nums">{children}</dd>
		</div>
	);
};

export default StatCell;
