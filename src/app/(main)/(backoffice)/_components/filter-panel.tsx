import { Fragment } from 'react';

import Link from 'next/link';

import type { FilterGroup } from '@/types/filter';

import type { SearchParamValue } from '@/lib/api';
import { cn } from '@/lib/utils';

import { toLinkQuery, toToggledQuery } from '@/utils/search-params';

const optionClassName =
	'group inline-flex h-7 items-center gap-1.5 rounded-full border bg-card px-2.5 text-[13px] font-semibold whitespace-nowrap hover:border-chart-neutral hover:bg-muted aria-[current]:border-foreground aria-[current]:bg-foreground aria-[current]:text-card';

interface Props {
	pathname: string;
	query: Record<string, SearchParamValue>;
	filterGroups: FilterGroup[];
	className?: string;
}

/**
 * 필터 패널 컴포넌트
 * @param pathname 값을 고르면 이동할 경로
 * @param query 현재 주소의 쿼리
 * @param filterGroups 그룹별로 고를 수 있는 값
 * @param className 패널의 폭을 정하는 class
 */
const FilterPanel = ({ pathname, query, filterGroups, className }: Props) => {
	const selected = filterGroups.some((filterGroup) => query[filterGroup.name] !== undefined);
	const clearedQuery = Object.fromEntries(filterGroups.map((filterGroup) => [filterGroup.name, undefined]));

	return (
		<div
			id="filter-panel"
			className={cn(
				'absolute top-[calc(100%+12px)] z-10 rounded-xl bg-card p-4 text-sm shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)] ring-1 ring-border max-md:inset-x-0 max-md:top-[calc(100%+4px)] md:right-0',
				className,
			)}
		>
			<dl className="grid grid-cols-[76px_minmax(0,1fr)] items-center gap-x-3 gap-y-2.5">
				{filterGroups.map((filterGroup) => (
					<Fragment key={filterGroup.name}>
						<dt className="text-[13px] text-muted-foreground">{filterGroup.label}</dt>
						<dd className="flex flex-wrap gap-1.5">
							{filterGroup.options.map((filterOption) => (
								<Link
									key={String(filterOption.value)}
									href={{
										pathname,
										query: toToggledQuery(query, filterGroup.name, filterOption.value),
									}}
									scroll={false}
									aria-current={query[filterGroup.name] === filterOption.value ? 'true' : undefined}
									className={optionClassName}
								>
									{filterOption.icon}
									{filterOption.label}
									{filterOption.count !== undefined && (
										<span className="font-medium text-muted-foreground tabular-nums group-aria-[current]:text-card/70">
											{filterOption.count.toLocaleString('ko-KR')}
										</span>
									)}
								</Link>
							))}
						</dd>
					</Fragment>
				))}
			</dl>

			{selected && (
				<footer className="mt-3.5 flex justify-end border-t pt-3">
					<Link
						href={{ pathname, query: toLinkQuery({ ...query, ...clearedQuery }) }}
						scroll={false}
						className="text-[13px] font-semibold text-muted-foreground hover:underline hover:underline-offset-3"
					>
						모두 지우기
					</Link>
				</footer>
			)}
		</div>
	);
};

export default FilterPanel;
