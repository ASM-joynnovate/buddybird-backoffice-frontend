import { cn } from '@/lib/utils';

import CountryFlag from '@/app/(main)/(backoffice)/_components/country-flag';
import { VISIBLE_FLAG_COUNT } from '@/config';
import { toCountryName } from '@/utils/country';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface Props {
	countries: string[];
	className?: string;
}

/**
 * 대상 국가의 국기 목록 컴포넌트, 마우스를 올리거나 누르면 국가 이름 목록 표시
 * @param countries 국가 코드 목록
 * @param className 국기 목록에 더할 class
 */
const CountryFlagGroup = ({ countries, className }: Props) => {
	// 전체 대상이면 표시하지 않음
	if (countries.length === 0) {
		return null;
	}

	return (
		<Popover>
			{/*행 전체를 덮는 버튼보다 위에 배치*/}
			<PopoverTrigger
				openOnHover
				delay={0}
				aria-label={`대상 국가 ${countries.map(toCountryName).join(', ')}`}
				className={cn(
					'relative inline-flex shrink-0 items-center gap-0.75 rounded-xs outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
					className,
				)}
			>
				{countries.slice(0, VISIBLE_FLAG_COUNT).map((country) => (
					<CountryFlag key={country} country={country} className="w-4" />
				))}
				{countries.length > VISIBLE_FLAG_COUNT && (
					<span className="ml-0.5 text-[12.5px] font-semibold text-muted-foreground tabular-nums">
						+{countries.length - VISIBLE_FLAG_COUNT}
					</span>
				)}
			</PopoverTrigger>
			<PopoverContent
				side="top"
				className="max-h-[min(15rem,var(--available-height))] w-auto max-w-xs gap-1 overflow-y-auto overscroll-contain bg-tooltip px-3 py-2 text-xs font-medium text-tooltip-foreground shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)] ring-0"
			>
				{countries.map((country) => (
					<span key={country} className="flex items-center gap-1.5">
						<CountryFlag country={country} className="w-4" />
						{toCountryName(country)}
					</span>
				))}
			</PopoverContent>
		</Popover>
	);
};

export default CountryFlagGroup;
