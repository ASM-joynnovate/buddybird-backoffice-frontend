import { PaginationMeta } from '@/types/common';

import { cn } from '@/lib/utils';

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

function getPageNumbers(currentPage: number, totalPageCount: number): (number | 'ellipsis')[] {
	if (totalPageCount <= 7) return Array.from({ length: totalPageCount }, (_, i) => i + 1);

	const pages: (number | 'ellipsis')[] = [1];
	if (currentPage > 3) pages.push('ellipsis');
	for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPageCount - 1, currentPage + 1); i++) pages.push(i);
	if (currentPage < totalPageCount - 2) pages.push('ellipsis');
	pages.push(totalPageCount);
	return pages;
}

interface PaginatedNavigationProps {
	meta: PaginationMeta;
	buildHref: (page: number) => string;
	className?: string;
}

export default function PaginatedNavigation({ meta, buildHref, className }: PaginatedNavigationProps) {
	const items = [
		<PaginationItem key="prev">
			<PaginationPrevious
				text="이전"
				href={!meta.isFirst ? buildHref(meta.currentPage - 1) : undefined}
				aria-disabled={meta.isFirst}
				className={cn(meta.isFirst && 'pointer-events-none opacity-50')}
			/>
		</PaginationItem>,
		...getPageNumbers(meta.currentPage, meta.totalPageCount).map((p, i) =>
			p === 'ellipsis' ? (
				<PaginationItem key={`ellipsis-${i}`}>
					<PaginationEllipsis />
				</PaginationItem>
			) : (
				<PaginationItem key={`page-${p}`}>
					<PaginationLink href={buildHref(p)} isActive={p === meta.currentPage}>
						{p}
					</PaginationLink>
				</PaginationItem>
			),
		),
		<PaginationItem key="next">
			<PaginationNext
				text="다음"
				href={!meta.isLast ? buildHref(meta.currentPage + 1) : undefined}
				aria-disabled={meta.isLast}
				className={cn(meta.isLast && 'pointer-events-none opacity-50')}
			/>
		</PaginationItem>,
	];

	return (
		<Pagination className={className}>
			<PaginationContent>{...items}</PaginationContent>
		</Pagination>
	);
}
