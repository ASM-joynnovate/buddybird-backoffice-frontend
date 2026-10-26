import { queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { getAbuseReportList, postAbuseReportHandle } from '@/apis/abuse-reports';

import type { AbuseReportListParams } from '@/types/apis/abuse-reports';

import { apiKeys } from '@/hooks/apis/keys';
import { useIdempotentMutation } from '@/hooks/apis/use-idempotent-mutation';

import { apiErrorMessage } from '@/lib/api';

import { toast } from 'sonner';

/** 신고 목록 조회 Hook에 사용할 옵션 */
export const getAbuseReportListOptions = (listParams: AbuseReportListParams) =>
	queryOptions({ queryKey: apiKeys.abuseReports.list(listParams), queryFn: () => getAbuseReportList(listParams) });
/** 신고 목록 조회 Hook */
export const useGetAbuseReportList = (listParams: AbuseReportListParams) => {
	return useSuspenseQuery(getAbuseReportListOptions(listParams));
};

/** 신고 처리 완료 Hook */
export const useHandleAbuseReport = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('abuse-reports', 'handle'),
		mutationFn: postAbuseReportHandle,
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: apiKeys.abuseReports.all() }),
				queryClient.invalidateQueries({ queryKey: apiKeys.dashboard.live() }),
			]);

			toast.success('신고를 처리했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};
