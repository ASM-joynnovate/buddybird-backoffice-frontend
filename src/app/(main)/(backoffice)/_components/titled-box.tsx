import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface Props {
	title: string;
	action?: ReactNode;
	className?: string;
	children: ReactNode;
}

/**
 * 제목 줄이 있는 테두리 상자 컴포넌트
 * @param title 상자 제목
 * @param action 제목 오른쪽 끝에 표시할 내용
 * @param className 상자에 더할 class
 * @param children 상자 내용
 */
const TitledBox = ({ title, action, className, children }: Props) => {
	return (
		<section className={cn('min-w-0 rounded-lg border bg-card', className)}>
			<div className="flex min-h-11 items-center justify-between gap-3 border-b px-3">
				<h5 className="text-[13px] font-bold">{title}</h5>
				{action}
			</div>

			{children}
		</section>
	);
};

export default TitledBox;
