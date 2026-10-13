import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { getEmergencyList } from '@/apis/emergencies';

import type { EmergencyListParams } from '@/types/apis/emergencies';

import { apiKeys } from '@/hooks/apis/keys';

/** 응급 상황 목록 조회 Hook에 사용할 옵션 */
export const getEmergencyListOptions = (listParams: EmergencyListParams) =>
	queryOptions({ queryKey: apiKeys.emergencies.list(listParams), queryFn: () => getEmergencyList(listParams) });
/** 응급 상황 목록 조회 Hook */
export const useGetEmergencyList = (listParams: EmergencyListParams) => {
	return useSuspenseQuery(getEmergencyListOptions(listParams));
};
