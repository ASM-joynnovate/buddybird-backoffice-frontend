'use client';

import { useState } from 'react';

import { Combobox } from '@base-ui/react/combobox';
import { Check, Search, X } from 'lucide-react';

import CountryFlag from '@/app/(main)/(backoffice)/_components/country-flag';
import { COUNTRY_CODES } from '@/config/countries';
import { toCountryName } from '@/utils/country';

// 한국어 이름순
const COUNTRY_OPTIONS = COUNTRY_CODES.toSorted((first, second) =>
	toCountryName(first).localeCompare(toCountryName(second), 'ko'),
);

/** 이름이나 국가 코드에 검색어가 포함된 국가만 표시 */
const filterCountry = (country: string, searchText: string) => {
	const normalizedSearchText = searchText.trim().toLowerCase();

	return (
		toCountryName(country).toLowerCase().includes(normalizedSearchText) ||
		country.toLowerCase().includes(normalizedSearchText)
	);
};

interface Props {
	countries: string[];
	onCountriesChange: (countries: string[]) => void;
}

/**
 * 국가를 검색해 여러 개 선택하는 입력 컴포넌트
 * @param countries 선택한 국가 코드
 * @param onCountriesChange 선택한 국가가 변경될 때 실행할 함수
 */
const CountryPicker = ({ countries, onCountriesChange }: Props) => {
	const [keyword, setKeyword] = useState('');

	const handleCountriesChange = (nextCountries: string[]) => {
		onCountriesChange(nextCountries);
		setKeyword('');
	};

	return (
		<Combobox.Root
			multiple
			items={COUNTRY_OPTIONS}
			value={countries}
			inputValue={keyword}
			filter={filterCountry}
			itemToStringLabel={toCountryName}
			onValueChange={handleCountriesChange}
			onInputValueChange={setKeyword}
		>
			<Combobox.InputGroup className="flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border bg-card p-0.75 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand hover:border-chart-neutral">
				<Search className="ml-2 size-4 text-muted-foreground" />

				<Combobox.Chips className="contents">
					{countries.map((country) => (
						<Combobox.Chip
							key={country}
							aria-label={toCountryName(country)}
							className="inline-flex h-7 items-center gap-1.5 rounded-sm bg-muted pr-1 pl-1.5 text-[13px] font-semibold whitespace-nowrap outline-none focus-within:outline-2 focus-within:outline-brand"
						>
							<CountryFlag country={country} />
							{toCountryName(country)}

							<Combobox.ChipRemove
								aria-label={`${toCountryName(country)} 빼기`}
								className="grid size-5 place-items-center rounded-sm text-muted-foreground hover:bg-card hover:text-foreground"
							>
								<X className="size-3.5" />
							</Combobox.ChipRemove>
						</Combobox.Chip>
					))}

					<Combobox.Input
						aria-label="국가 검색"
						placeholder={countries.length > 0 ? '' : '국가 이름, 코드'}
						className="h-7 min-w-37.5 flex-1 bg-transparent px-1.5 outline-none placeholder:text-muted-foreground"
					/>
				</Combobox.Chips>
			</Combobox.InputGroup>

			<Combobox.Portal>
				<Combobox.Positioner sideOffset={6} className="z-50">
					<Combobox.Popup className="max-h-65.5 w-(--anchor-width) [scrollbar-width:thin] overflow-y-auto overscroll-contain rounded-lg bg-card p-1.5 shadow-[0_0_0_1px_var(--border),0_10px_24px_-8px_rgb(0_0_0/0.4)]">
						<Combobox.Empty className="px-2 py-3.5 text-[13px] text-muted-foreground empty:hidden">
							검색 결과가 없습니다.
						</Combobox.Empty>

						<Combobox.List>
							{(country: string) => (
								<Combobox.Item
									key={country}
									value={country}
									className="flex h-9 cursor-pointer items-center gap-2.5 rounded-md px-2.5 outline-none select-none data-highlighted:bg-muted data-selected:font-semibold"
								>
									<CountryFlag country={country} />
									<span className="truncate">{toCountryName(country)}</span>
									<span className="text-xs text-muted-foreground">{country}</span>

									<Combobox.ItemIndicator className="ml-auto">
										<Check className="size-4" strokeWidth={2.25} />
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

export default CountryPicker;
