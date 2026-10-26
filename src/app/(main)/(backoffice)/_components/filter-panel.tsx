import { Fragment } from 'react';

import Link from 'next/link';

import type { FilterGroup } from '@/types/filter';

import type { SearchParamValue } from '@/lib/api';
import { cn } from '@/lib/utils';

import FilterNumberInput from '@/app/(main)/(backoffice)/_components/filter-number-input';
import { toClearedQuery, toLinkQuery } from '@/utils/search-params';

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
 * @param pathname 값을 선택하면 이동할 경로
 * @param query 현재 주소의 쿼리
 * @param filterGroups 그룹별로 선택할 수 있는 값
 * @param className 패널의 폭을 정하는 class
 */
const FilterPanel = ({ pathname, query, filterGroups, className }: Props) => {
	const selected = filterGroups.some((filterGroup) => query[filterGroup.name] !== undefined);
	const clearedQuery = Object.fromEntries(filterGroups.map((filterGroup) => [filterGroup.name, undefined]));

	return (
		<div
			id="filter-panel"
			className={cn(
				'absolute top-[calc(100%+12px)] z-10 rounded-xl bg-card p-4 text-sm shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)] ring-1 ring-border max-md:inset-x-0 max-md:top-[calc(100%+4px)] md:left-0',
				className,
			)}
		>
			<dl className="grid grid-cols-[76px_minmax(0,1fr)] items-center gap-x-3 gap-y-2.5">
				{filterGroups.map((filterGroup) => {
					const optionValues = filterGroup.options.map((filterOption) => String(filterOption.value));
					// 값이 없으면 기본값을 선택한 것으로 표시
					const selectedValue = query[filterGroup.name] ?? filterGroup.defaultValue;
					const selectedValues = String(selectedValue).split(',');
					const allSelected =
						filterGroup.multiple && optionValues.every((value) => selectedValues.includes(value));

					/** 선택한 값의 링크 쿼리를 반환하는 함수 */
					const toSelectedQuery = (value: SearchParamValue) =>
						toLinkQuery({
							...query,
							...toClearedQuery(filterGroup.resetNames),
							// 기본값은 쿼리에서 제외
							[filterGroup.name]: value === filterGroup.defaultValue ? undefined : value,
						});

					/** 선택을 토글한 값을 반환하는 함수 */
					const toToggledValues = (value: string) => {
						const baseValues = allSelected ? [] : selectedValues;
						const nextValues = optionValues.filter((optionValue) =>
							optionValue === value ? !baseValues.includes(value) : baseValues.includes(optionValue),
						);

						// 모두 해제하면 전체 선택
						return (nextValues.length > 0 ? nextValues : optionValues).join(',');
					};

					return (
						<Fragment key={filterGroup.name}>
							<dt className="text-[13px] text-muted-foreground">{filterGroup.label}</dt>
							<dd className="flex flex-wrap gap-1.5">
								{!!filterGroup.inputUnit && (
									<FilterNumberInput
										pathname={pathname}
										query={query}
										name={filterGroup.name}
										label={filterGroup.label}
										unit={filterGroup.inputUnit}
									/>
								)}

								{!!filterGroup.allOption && (
									<Link
										href={{
											pathname,
											query: filterGroup.multiple
												? toSelectedQuery(optionValues.join(','))
												: toLinkQuery({ ...query, ...toClearedQuery([filterGroup.name]) }),
										}}
										scroll={false}
										aria-current={
											(filterGroup.multiple ? allSelected : selectedValue === undefined)
												? 'true'
												: undefined
										}
										className={optionClassName}
									>
										{filterGroup.allOption.label}
										{filterGroup.allOption.count !== undefined && (
											<span className="font-medium text-muted-foreground tabular-nums group-aria-[current]:text-card/70">
												{filterGroup.allOption.count.toLocaleString('ko-KR')}
											</span>
										)}
									</Link>
								)}

								{filterGroup.options.map((filterOption) => {
									const optionValue = String(filterOption.value);
									const optionSelected = filterGroup.multiple
										? !allSelected && selectedValues.includes(optionValue)
										: selectedValue === filterOption.value;

									return (
										<Link
											key={optionValue}
											href={{
												pathname,
												// 값이 변경되면 하위 조건도 함께 해제
												query: filterGroup.multiple
													? toSelectedQuery(toToggledValues(optionValue))
													: toSelectedQuery(optionSelected ? undefined : filterOption.value),
											}}
											scroll={false}
											aria-current={optionSelected ? 'true' : undefined}
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
									);
								})}
							</dd>
						</Fragment>
					);
				})}
			</dl>

			{/*패널 높이 유지를 위해 항상 표시*/}
			<footer className="mt-3.5 flex justify-end border-t pt-3 text-[13px] font-semibold text-muted-foreground">
				{selected ? (
					<Link
						href={{ pathname, query: toLinkQuery({ ...query, ...clearedQuery }) }}
						scroll={false}
						className="hover:underline hover:underline-offset-3"
					>
						모두 지우기
					</Link>
				) : (
					<span aria-disabled className="opacity-45">
						모두 지우기
					</span>
				)}
			</footer>
		</div>
	);
};

export default FilterPanel;
