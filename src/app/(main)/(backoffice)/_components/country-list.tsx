'use client';

import { useEffect, useRef, useState } from 'react';

import type { UserDashboard } from '@/types/apis/dashboard';

import { cn } from '@/lib/utils';

import { VISIBLE_COUNTRY_COUNT } from '@/config';
import { toCountryName } from '@/utils/country';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Props {
	countries: UserDashboard['countries'];
	className?: string;
}

/**
 * 국가별 접속 사용자 목록 컴포넌트
 * @param countries 접속 사용자가 많은 순서의 국가 목록
 * @param className 목록의 열 수 및 최소 높이를 정하는 class
 */
const CountryList = ({ countries, className }: Props) => {
	const countryListRef = useRef<HTMLUListElement>(null);

	const [maxRowCount, setMaxRowCount] = useState(VISIBLE_COUNTRY_COUNT + 2);

	const countriesEmpty = countries.length === 0;
	const knownCountries = countries.flatMap(({ country, count }) => (country ? [{ country, count }] : []));
	const unknownCountries = countries.filter(({ country }) => country === null);
	// 넘치면 한 행은 나머지 국가의 합
	const visibleCountryCount =
		knownCountries.length + unknownCountries.length > maxRowCount
			? maxRowCount - unknownCountries.length - 1
			: knownCountries.length;
	const hiddenCountries = knownCountries.slice(visibleCountryCount);

	const totalCount = countries.reduce((total, { count }) => total + count, 0);
	const maxCount = Math.max(1, ...countries.map(({ count }) => count));

	// 이름 있는 국가, 나머지 국가의 합, 국가를 알 수 없는 사용자 순서
	const countryRows = [
		...knownCountries.slice(0, visibleCountryCount).map(({ country, count }) => ({
			name: toCountryName(country),
			code: country,
			count,
			known: true,
			countriesHidden: false,
		})),
		...(hiddenCountries.length > 0
			? [
					{
						name: `그 외 ${hiddenCountries.length}개국`,
						code: '',
						count: hiddenCountries.reduce((total, { count }) => total + count, 0),
						known: true,
						countriesHidden: true,
					},
				]
			: []),
		...unknownCountries.map(({ count }) => ({
			name: '알 수 없음',
			code: '',
			count,
			known: false,
			countriesHidden: false,
		})),
	];

	/** 목록 높이에 들어가는 행 수 계산 */
	useEffect(() => {
		const countryList = countryListRef.current;

		if (!countryList) {
			return;
		}

		const resizeObserver = new ResizeObserver(() => {
			// 구분선 있는 행이 1px 더 높음
			const rowHeight = Math.max(...[...countryList.children].map((row) => row.getBoundingClientRect().height));
			const columnCount = getComputedStyle(countryList).gridTemplateColumns.split(' ').length;

			setMaxRowCount(Math.floor(countryList.clientHeight / rowHeight) * columnCount);
		});

		resizeObserver.observe(countryList);

		return () => resizeObserver.disconnect();
	}, [countriesEmpty]);

	if (countriesEmpty) {
		return <p className="text-muted-foreground">접속 기록이 없습니다.</p>;
	}

	return (
		<ul
			ref={countryListRef}
			className={cn('grid min-h-79 grow basis-0 content-start overflow-hidden tabular-nums', className)}
		>
			{countryRows.map((countryRow) => (
				<li
					key={countryRow.name}
					className="grid grid-cols-[minmax(0,1fr)_auto_38px] items-center gap-x-2.5 gap-y-1 py-2"
				>
					<span className={cn('truncate', countryRow.known ? 'font-semibold' : 'text-muted-foreground')}>
						{countryRow.countriesHidden ? (
							<Popover>
								<PopoverTrigger
									openOnHover
									delay={0}
									className="font-semibold outline-none focus-visible:underline"
								>
									{countryRow.name}
								</PopoverTrigger>
								<PopoverContent
									side="top"
									className="max-h-(--available-height) w-auto max-w-xs gap-1 overflow-y-auto bg-tooltip px-3 py-2 text-xs text-tooltip-foreground tabular-nums shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)] ring-0"
								>
									{hiddenCountries.map(({ country, count }) => (
										<div key={country} className="flex items-center justify-between gap-4">
											<span className="text-tooltip-foreground/75">{toCountryName(country)}</span>
											<strong className="text-[13px] font-bold">
												{count.toLocaleString('ko-KR')}
											</strong>
										</div>
									))}
								</PopoverContent>
							</Popover>
						) : (
							countryRow.name
						)}
						{!!countryRow.code && (
							<span className="ml-1.5 text-[12.5px] font-normal text-muted-foreground">
								{countryRow.code}
							</span>
						)}
					</span>
					<strong className="font-bold">{countryRow.count.toLocaleString('ko-KR')}</strong>
					<span className="text-right text-[13px] text-muted-foreground">
						{Math.round((countryRow.count / totalCount) * 100)}%
					</span>

					<div aria-hidden className="col-span-full h-1 rounded-full bg-muted">
						<div
							className={cn('h-full rounded-full', countryRow.known ? 'bg-chart-2' : 'bg-chart-neutral')}
							style={{ width: `${(countryRow.count / maxCount) * 100}%` }}
						/>
					</div>
				</li>
			))}
		</ul>
	);
};

export default CountryList;
