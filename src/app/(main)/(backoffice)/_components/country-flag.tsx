import { cn } from '@/lib/utils';

import { COUNTRY_CODES } from '@/config/countries';
import { toSpriteStyle } from '@/utils/sprite';

interface Props {
	country: string;
	className?: string;
}

/**
 * 국기 컴포넌트
 * @param country 국가 코드
 * @param className 크기를 정하는 class
 */
const CountryFlag = ({ country, className }: Props) => {
	const countryIndex = COUNTRY_CODES.indexOf(country);

	// 국기가 없는 국가는 표시하지 않음
	if (countryIndex === -1) {
		return null;
	}

	return (
		<span
			aria-hidden
			className={cn('inline-block aspect-4/3 w-5 shrink-0 rounded-[3px] ring-1 ring-foreground/10', className)}
			style={toSpriteStyle('/images/flags.png', countryIndex, COUNTRY_CODES.length)}
		/>
	);
};

export default CountryFlag;
