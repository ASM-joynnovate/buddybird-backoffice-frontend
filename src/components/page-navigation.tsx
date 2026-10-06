import type { PageMeta } from '@/types/apis/common';

import type { SearchParamValue } from '@/lib/api';
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

/** 표시할 페이지 번호 목록을 반환하는 함수 */
const pageNumbers = (currentPage: number, totalPageCount: number) => {
	if (totalPageCount <= 7) {
		return Array.from({ length: totalPageCount }, (_, index) => index + 1);
	}

	const pages: (number | 'ellipsis')[] = [1];

	if (currentPage > 3) {
		pages.push('ellipsis');
	}

	for (let page = Math.max(2, currentPage - 1); page <= Math.min(totalPageCount - 1, currentPage + 1); page++) {
		pages.push(page);
	}

	if (currentPage < totalPageCount - 2) {
		pages.push('ellipsis');
	}

	pages.push(totalPageCount);

	return pages;
};

interface Props {
	meta: PageMeta;
	pathname: string;
	query?: Record<string, SearchParamValue>;
	pageParam?: string;
}

/**
 * 페이지 이동 링크 컴포넌트
 * @param meta 목록의 페이지 정보
 * @param pathname 목록 화면 경로
 * @param query 페이지 번호와 함께 유지할 쿼리 값
 * @param pageParam 페이지 번호의 쿼리 이름
 */
const PageNavigation = ({ meta, pathname, query, pageParam = 'page' }: Props) => {
	/** 페이지 번호가 들어간 링크 주소를 반환하는 함수 */
	const pageHref = (page: number) => {
		const entries = Object.entries({ ...query, [pageParam]: page }).filter(([, value]) => value !== undefined);

		return { pathname, query: Object.fromEntries(entries) };
	};

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						text="이전"
						href={meta.is_first ? undefined : pageHref(meta.current_page - 1)}
						aria-disabled={meta.is_first}
						className={cn(meta.is_first && 'pointer-events-none opacity-50')}
					/>
				</PaginationItem>

				{pageNumbers(meta.current_page, meta.total_page_count).map((page, index) =>
					page === 'ellipsis' ? (
						<PaginationItem key={`ellipsis-${index}`}>
							<PaginationEllipsis />
						</PaginationItem>
					) : (
						<PaginationItem key={page}>
							<PaginationLink href={pageHref(page)} isActive={page === meta.current_page}>
								{page}
							</PaginationLink>
						</PaginationItem>
					),
				)}

				<PaginationItem>
					<PaginationNext
						text="다음"
						href={meta.is_last ? undefined : pageHref(meta.current_page + 1)}
						aria-disabled={meta.is_last}
						className={cn(meta.is_last && 'pointer-events-none opacity-50')}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};

export default PageNavigation;
