type UrlSearchParam = string | string[] | undefined;

/** 쿼리 값을 1 이상의 페이지 번호로 변환하는 함수 */
export const toPageNumber = (value: UrlSearchParam) => {
	const page = Number(value);

	return Number.isInteger(page) && page >= 1 ? page : 1;
};

/** 빈 쿼리 값을 undefined로 변환하는 함수 */
export const toOptionalText = (value: UrlSearchParam) => {
	if (typeof value !== 'string') {
		return undefined;
	}

	return value.trim() || undefined;
};

/** 'true', 'false' 쿼리 값을 boolean으로 변환하는 함수 */
export const toOptionalBoolean = (value: UrlSearchParam) => {
	if (value === 'true') {
		return true;
	}

	return value === 'false' ? false : undefined;
};
