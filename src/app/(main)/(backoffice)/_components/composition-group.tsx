import Link from 'next/link';

import type { SearchParamValue } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Props {
	title?: string;
	parts: {
		value: string;
		label: string;
		percent: number;
		colorClassName: string;
		dimmed: boolean;
		href: { pathname: string; query: Record<string, SearchParamValue> };
	}[];
}

/**
 * 값별 비율 막대 및 범례 컴포넌트
 * @param title 그룹 제목
 * @param parts 값별 비율, 색, 누르면 이동할 주소
 */
const CompositionGroup = ({ title, parts }: Props) => {
	return (
		<section>
			<h3 className="mb-2 text-[13px] font-semibold">{title}</h3>

			<div className="flex h-3 gap-0.75">
				{parts.map((part) => (
					<Link
						key={part.value}
						href={part.href}
						scroll={false}
						aria-label={`${part.label} ${part.percent}%`}
						className={cn(
							'min-w-1.5 basis-0 rounded-full transition-opacity',
							part.colorClassName,
							part.dimmed && 'opacity-40',
						)}
						style={{ flexGrow: part.percent }}
					/>
				))}
			</div>

			<ul className="mt-2 flex flex-wrap gap-x-3.5 gap-y-1 text-[13px]">
				{parts.map((part) => (
					<li key={part.value}>
						<Link
							href={part.href}
							scroll={false}
							className={cn(
								'inline-flex items-center gap-1.5 rounded-sm text-muted-foreground transition-opacity hover:text-foreground',
								part.dimmed && 'opacity-40',
							)}
						>
							<span className={cn('size-2 shrink-0 rounded-full', part.colorClassName)} />
							{part.label}
							<strong className="font-bold text-foreground tabular-nums">{part.percent}%</strong>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
};

export default CompositionGroup;
