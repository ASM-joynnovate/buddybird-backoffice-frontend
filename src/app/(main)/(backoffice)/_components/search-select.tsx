'use client';

import { type ReactNode, useState } from 'react';

import { Combobox } from '@base-ui/react/combobox';
import { Check, ChevronDown, PencilLine, Search } from 'lucide-react';

interface Props {
	label: string;
	value: string | null;
	options: string[];
	placeholder: string;
	customOptionAllowed?: boolean;
	toOptionLabel: (option: string) => string;
	toOptionNote?: (option: string) => string;
	toOptionIcon?: (option: string) => ReactNode;
	onValueChange: (value: string) => void;
}

/**
 * 목록을 검색해 값 하나를 선택하는 입력 컴포넌트
 * @param label 입력의 이름
 * @param value 선택한 값
 * @param options 선택할 수 있는 값 목록
 * @param placeholder 검색 입력이 비었을 때 표시할 문구
 * @param customOptionAllowed 검색어를 그대로 값으로 선택할 수 있는지 여부
 * @param toOptionLabel 값을 화면에 표시할 이름으로 변환하는 함수
 * @param toOptionNote 값 오른쪽에 작게 표시할 문구를 반환하는 함수
 * @param toOptionIcon 값 왼쪽에 표시할 아이콘을 반환하는 함수
 * @param onValueChange 값을 선택하면 실행할 함수
 */
const SearchSelect = ({
	label,
	value,
	options,
	placeholder,
	customOptionAllowed = false,
	toOptionLabel,
	toOptionNote,
	toOptionIcon,
	onValueChange,
}: Props) => {
	const [query, setQuery] = useState('');

	const customOption = query.trim();
	const customOptionShown =
		customOptionAllowed &&
		!!customOption &&
		!options.some((option) => option === customOption || toOptionLabel(option) === customOption);
	// 목록에 없는 현재 값도 선택 표시
	const items = [
		...(value && !options.includes(value) ? [value] : []),
		...options,
		...(customOptionShown ? [customOption] : []),
	];

	/** 이름이나 값에 검색어가 들어간 항목만 표시 */
	const filterOption = (option: string, searchText: string) => {
		const normalizedSearchText = searchText.trim().toLowerCase();

		return (
			toOptionLabel(option).toLowerCase().includes(normalizedSearchText) ||
			option.toLowerCase().includes(normalizedSearchText)
		);
	};

	const handleValueChange = (nextValue: string | null) => {
		if (nextValue) {
			onValueChange(nextValue);
		}
	};

	return (
		<Combobox.Root
			items={items}
			value={value}
			inputValue={query}
			filter={filterOption}
			itemToStringLabel={toOptionLabel}
			onInputValueChange={setQuery}
			onValueChange={handleValueChange}
		>
			<Combobox.Trigger
				aria-label={label}
				className="flex h-9 w-full min-w-0 items-center gap-2 rounded-md border bg-card px-3 text-left hover:border-chart-neutral focus-visible:border-chart-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand data-popup-open:border-chart-neutral"
			>
				{!!value && toOptionIcon?.(value)}
				<span className="truncate font-semibold">{value ? toOptionLabel(value) : '-'}</span>
				{!!value && !!toOptionNote && (
					<span className="text-xs text-muted-foreground tabular-nums">{toOptionNote(value)}</span>
				)}
				<ChevronDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
			</Combobox.Trigger>

			<Combobox.Portal>
				<Combobox.Positioner align="start" sideOffset={4} className="isolate z-50">
					<Combobox.Popup
						aria-label={label}
						className="w-(--anchor-width) max-w-(--available-width) rounded-lg bg-popover p-1.5 text-popover-foreground shadow-md ring-1 ring-foreground/10"
					>
						<div className="flex h-9 items-center gap-2 rounded-md border px-2.5 focus-within:border-chart-neutral">
							<Search className="size-4 shrink-0 text-muted-foreground" />
							<Combobox.Input
								aria-label={`${label} 검색`}
								placeholder={placeholder}
								className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
							/>
						</div>

						<Combobox.Empty className="px-2.5 py-3 text-[13px] text-muted-foreground empty:hidden">
							검색 결과가 없습니다.
						</Combobox.Empty>

						<Combobox.List className="mt-1 max-h-[min(15rem,calc(var(--available-height)-3rem))] overflow-y-auto overscroll-contain empty:hidden">
							{(option: string) => (
								<Combobox.Item
									key={option}
									value={option}
									className="flex h-8 cursor-default items-center gap-2 rounded-md px-2.5 text-sm select-none data-highlighted:bg-muted data-selected:font-semibold"
								>
									{customOptionShown && option === customOption ? (
										<>
											<PencilLine className="size-3.5 text-muted-foreground" />
											<span className="truncate">‘{customOption}’ 직접 입력</span>
										</>
									) : (
										<>
											{toOptionIcon?.(option)}
											<span className="truncate">{toOptionLabel(option)}</span>
										</>
									)}

									{!!toOptionNote && (
										<span className="ml-auto text-xs text-muted-foreground tabular-nums">
											{toOptionNote(option)}
										</span>
									)}
									<Combobox.ItemIndicator className={toOptionNote ? undefined : 'ml-auto'}>
										<Check className="size-4" />
									</Combobox.ItemIndicator>
								</Combobox.Item>
							)}
						</Combobox.List>
					</Combobox.Popup>
				</Combobox.Positioner>
			</Combobox.Portal>
		</Combobox.Root>
	);
};

export default SearchSelect;
