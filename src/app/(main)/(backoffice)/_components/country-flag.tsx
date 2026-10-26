import Image from 'next/image';

import { cn } from '@/lib/utils';

import { COUNTRY_CODES } from '@/config/countries';

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
	// 국기 파일이 없는 국가는 표시하지 않음
	if (!COUNTRY_CODES.includes(country)) {
		return null;
	}

	return (
		<Image
			src={`/images/flags/${country.toLowerCase()}.svg`}
			alt=""
			width={20}
			height={15}
			className={cn('h-[15px] w-5 shrink-0 rounded-[3px] ring-1 ring-foreground/10', className)}
		/>
	);
};

export default CountryFlag;
