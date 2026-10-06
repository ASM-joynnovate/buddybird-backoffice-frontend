import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { getFeedbackList } from '@/apis/feedback';

import { apiKeys } from '@/hooks/apis/keys';

/** 피드백 목록 조회 Hook에 사용할 옵션 */
export const getFeedbackListOptions = ({ page }: { page: number }) =>
	queryOptions({ queryKey: apiKeys.feedback.list(page), queryFn: () => getFeedbackList({ page }) });
/** 피드백 목록 조회 Hook */
export const useGetFeedbackList = ({ page }: { page: number }) => {
	return useSuspenseQuery(getFeedbackListOptions({ page }));
};
