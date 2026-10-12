import type { UserDashboard } from '@/types/apis/dashboard';

import { cn } from '@/lib/utils';

import { VISIBLE_COUNTRY_COUNT } from '@/config';
import { toCountryName } from '@/utils/country';

interface Props {
	countries: UserDashboard['countries'];
	className?: string;
}

/**
 * 국가별 접속 사용자 목록 컴포넌트
 * @param countries 접속 사용자가 많은 순서의 국가 목록
 * @param className 목록의 열 수를 정하는 class
 */
const CountryList = ({ countries, className }: Props) => {
	const knownCountries = countries.flatMap(({ country, count }) => (country ? [{ country, count }] : []));
	const hiddenCountries = knownCountries.slice(VISIBLE_COUNTRY_COUNT);

	const totalCount = countries.reduce((total, { count }) => total + count, 0);
	const maxCount = Math.max(1, ...countries.map(({ count }) => count));

	// 이름 있는 국가, 나머지 국가의 합, 국가를 알 수 없는 사용자 순서
	const countryRows = [
		...knownCountries.slice(0, VISIBLE_COUNTRY_COUNT).map(({ country, count }) => ({
			name: toCountryName(country),
			code: country,
			count,
			known: true,
		})),
		...(hiddenCountries.length > 0
			? [
					{
						name: `그 외 ${hiddenCountries.length}개국`,
						code: '',
						count: hiddenCountries.reduce((total, { count }) => total + count, 0),
						known: true,
					},
				]
			: []),
		...countries.flatMap(({ country, count }) =>
			country === null ? [{ name: '알 수 없음', code: '', count, known: false }] : [],
		),
	];

	if (countryRows.length === 0) {
		return <p className="text-muted-foreground">접속 기록이 없습니다.</p>;
	}

	return (
		<ul className={cn('grid tabular-nums', className)}>
			{countryRows.map((countryRow) => (
				<li
					key={countryRow.name}
					className="grid grid-cols-[minmax(0,1fr)_auto_38px] items-center gap-x-2.5 gap-y-1 py-2"
				>
					<span className={cn('truncate', countryRow.known ? 'font-semibold' : 'text-muted-foreground')}>
						{countryRow.name}
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
