'use client';

import { useRouter } from 'next/navigation';

import type { SearchParamValue } from '@/lib/api';

import { toUrlSearchParams } from '@/utils/search-params';

import { Input } from '@/components/ui/input';

interface Props {
	pathname: string;
	query: Record<string, SearchParamValue>;
	name: string;
	label: string;
	unit: string;
}

/**
 * 필터 패널의 숫자 입력 컴포넌트
 * @param pathname 값을 입력하면 이동할 경로
 * @param query 현재 주소의 쿼리
 * @param name 쿼리에 저장할 이름
 * @param label 입력의 이름
 * @param unit 입력창 뒤에 적는 단위
 */
const FilterNumberInput = ({ pathname, query, name, label, unit }: Props) => {
	const router = useRouter();

	const handleCommit = (value: string) => {
		// 1보다 작은 값은 조건을 지움
		const count = Math.floor(Number(value));
		const nextValue = count >= 1 ? count : undefined;

		if (nextValue === query[name]) {
			return;
		}

		router.push(`${pathname}?${toUrlSearchParams({ ...query, [name]: nextValue })}`, { scroll: false });
	};

	return (
		<label className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
			{/*쿼리의 값이 바뀌면 입력값을 새로 채움*/}
			<Input
				key={String(query[name])}
				type="number"
				min={1}
				step={1}
				inputMode="numeric"
				aria-label={label}
				defaultValue={query[name] === undefined ? '' : String(query[name])}
				className="h-7 w-14 [appearance:textfield] rounded-sm px-2 text-right text-[13px] font-semibold tabular-nums md:text-[13px] [&::-webkit-inner-spin-button]:appearance-none"
				onBlur={(event) => handleCommit(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === 'Enter') {
						event.currentTarget.blur();
					}
				}}
			/>
			{unit}
		</label>
	);
};

export default FilterNumberInput;
