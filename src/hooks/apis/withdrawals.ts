import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { getWithdrawalList } from '@/apis/withdrawals';

import type { WithdrawalListParams } from '@/types/apis/withdrawals';

import { apiKeys } from '@/hooks/apis/keys';

import { WITHDRAWAL_REFETCH_INTERVAL_MS } from '@/config';

/** 탈퇴 처리 현황 조회 Hook에 사용할 옵션 */
export const getWithdrawalListOptions = (listParams: WithdrawalListParams) =>
	queryOptions({
		queryKey: apiKeys.withdrawals.list(listParams),
		queryFn: () => getWithdrawalList(listParams),
		// 완료되지 않은 탈퇴가 있을 때만 다시 조회
		refetchInterval: (query) =>
			query.state.data?.data.some((withdrawal) => withdrawal.status !== 'completed')
				? WITHDRAWAL_REFETCH_INTERVAL_MS
				: false,
	});
/** 탈퇴 처리 현황 조회 Hook */
export const useGetWithdrawalList = (listParams: WithdrawalListParams) => {
	return useSuspenseQuery(getWithdrawalListOptions(listParams));
};
