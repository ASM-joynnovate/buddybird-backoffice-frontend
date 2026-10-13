import Link from 'next/link';

import type { SelectedFilter } from '@/types/filter';

import type { SearchParamValue } from '@/lib/api';

import { X } from 'lucide-react';

import { toClearedQuery, toLinkQuery } from '@/utils/search-params';

interface Props {
	pathname: string;
	query: Record<string, SearchParamValue>;
	selectedFilters: SelectedFilter[];
}

/**
 * 선택한 조건의 칩 목록 컴포넌트
 * @param pathname 칩을 누르면 이동할 경로
 * @param query 현재 주소의 쿼리
 * @param selectedFilters 칩으로 표시할 조건
 */
const SelectedFilters = ({ pathname, query, selectedFilters }: Props) => {
	return (
		<>
			{selectedFilters.map((selectedFilter) => (
				<Link
					key={selectedFilter.name}
					href={{
						pathname,
						// 칩을 누르면 그 조건 및 딸린 조건을 지움
						query: toLinkQuery({
							...query,
							...toClearedQuery([selectedFilter.name, ...(selectedFilter.resetNames ?? [])]),
						}),
					}}
					scroll={false}
					aria-label={`${selectedFilter.label} 조건 지우기`}
					className="inline-flex h-7 items-center gap-1.5 rounded-md bg-card pr-1.5 pl-2.5 text-[13px] font-semibold whitespace-nowrap ring-1 ring-border hover:bg-muted"
				>
					{!!selectedFilter.groupLabel && (
						<small className="text-[12.5px] font-medium text-muted-foreground">
							{selectedFilter.groupLabel}
						</small>
					)}
					{selectedFilter.icon}
					{selectedFilter.label}
					<X className="size-3.5 text-muted-foreground" />
				</Link>
			))}
		</>
	);
};

export default SelectedFilters;
