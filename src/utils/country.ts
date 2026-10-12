const countryNames = new Intl.DisplayNames('ko', { type: 'region' });

/** 국가 코드를 한국어 이름으로 변환하는 함수 */
export const toCountryName = (country: string) => {
	return countryNames.of(country) ?? country;
};
