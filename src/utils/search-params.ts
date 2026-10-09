import { localDateSchema } from '@/types/apis/primitives';
import type { UserListParams } from '@/types/apis/users';

import type { SearchParamValue } from '@/lib/api';

import { DASHBOARD_MAX_PERIOD_DAYS, DASHBOARD_PERIODS, DEFAULT_DASHBOARD_PERIOD } from '@/config';
import { USER_FILTER_GROUPS, type UserFilters } from '@/config/user-filters';
import { addDays, countDays } from '@/utils/date';

type UrlSearchParam = string | string[] | undefined;

/** 쿼리 값을 1 이상의 페이지 번호로 변환하는 함수 */
export const toPageNumber = (value: UrlSearchParam) => {
	const page = Number(value);

	return Number.isInteger(page) && page >= 1 ? page : 1;
};

/** 쿼리 값을 대시보드의 조회 기간으로 변환하는 함수 */
export const toDashboardPeriod = (value: UrlSearchParam) => {
	return DASHBOARD_PERIODS.find((period) => String(period) === value) ?? DEFAULT_DASHBOARD_PERIOD;
};

/** 쿼리 값을 대시보드 조회 기간으로 변환하는 함수 */
export const toDashboardParams = (dateFrom: UrlSearchParam, dateTo: UrlSearchParam) => {
	const date_from = localDateSchema.safeParse(dateFrom).data;
	const date_to = localDateSchema.safeParse(dateTo).data;

	if (!date_from || !date_to) {
		return undefined;
	}

	const dayCount = countDays(date_from, date_to);

	return dayCount >= 1 && dayCount <= DASHBOARD_MAX_PERIOD_DAYS ? { date_from, date_to } : undefined;
};

/** 빈 쿼리 값을 undefined로 변환하는 함수 */
export const toOptionalText = (value: UrlSearchParam) => {
	if (typeof value !== 'string') {
		return undefined;
	}

	return value.trim() || undefined;
};

/** 쿼리에서 사용자 필터로 고른 값을 꺼내는 함수 */
export const toUserFilters = (searchParams: Record<string, UrlSearchParam>) => {
	const userFilters: UserFilters = {};

	for (const filterGroup of USER_FILTER_GROUPS) {
		userFilters[filterGroup.name] = filterGroup.options.find(
			(filterOption) => filterOption.value === searchParams[filterGroup.name],
		)?.value;
	}

	return userFilters;
};

/** 고른 사용자 필터를 목록 조회 조건으로 변환하는 함수 */
export const toUserFilterParams = (userFilters: UserFilters, today: string) => {
	const listParams: Partial<UserListParams> = {};

	for (const filterGroup of USER_FILTER_GROUPS) {
		const filterOption = filterGroup.options.find(({ value }) => value === userFilters[filterGroup.name]);

		Object.assign(listParams, filterOption?.listParams);

		if (filterOption?.createdDayCount) {
			listParams.created_from = addDays(today, 1 - filterOption.createdDayCount);
			listParams.created_to = today;
		}
	}

	return listParams;
};

/** 값이 없는 항목을 뺀 링크 쿼리를 반환하는 함수 */
export const toLinkQuery = (query: Record<string, SearchParamValue>) => {
	return Object.fromEntries(Object.entries(query).filter(([, value]) => value !== undefined));
};

/** 링크 쿼리를 주소에 붙일 URLSearchParams로 변환하는 함수 */
export const toUrlSearchParams = (query: Record<string, SearchParamValue>) => {
	return new URLSearchParams(Object.entries(toLinkQuery(query)).map(([name, value]) => [name, String(value)]));
};

/** 이미 고른 값이면 빼고 아니면 넣은 링크 쿼리를 반환하는 함수 */
export const toToggledQuery = (query: Record<string, SearchParamValue>, name: string, value: SearchParamValue) => {
	return toLinkQuery({ ...query, [name]: query[name] === value ? undefined : value });
};
