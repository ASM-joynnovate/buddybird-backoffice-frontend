import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { getWithdrawalList } from '@/apis/withdrawals';

import type { WithdrawalListParams } from '@/types/apis/withdrawals';

import { apiKeys } from '@/hooks/apis/keys';

/** 탈퇴 처리 현황 조회 Hook에 사용할 옵션 */
export const getWithdrawalListOptions = (listParams: WithdrawalListParams) =>
	queryOptions({ queryKey: apiKeys.withdrawals.list(listParams), queryFn: () => getWithdrawalList(listParams) });
/** 탈퇴 처리 현황 조회 Hook */
export const useGetWithdrawalList = (listParams: WithdrawalListParams) => {
	return useSuspenseQuery(getWithdrawalListOptions(listParams));
};
