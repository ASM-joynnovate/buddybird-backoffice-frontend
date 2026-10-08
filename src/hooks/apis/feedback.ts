import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { getFeedbackList } from '@/apis/feedback';

import type { FeedbackListParams } from '@/types/apis/feedback';

import { apiKeys } from '@/hooks/apis/keys';

/** 피드백 목록 조회 Hook에 사용할 옵션 */
export const getFeedbackListOptions = (listParams: FeedbackListParams) =>
	queryOptions({ queryKey: apiKeys.feedback.list(listParams), queryFn: () => getFeedbackList(listParams) });
/** 피드백 목록 조회 Hook */
export const useGetFeedbackList = (listParams: FeedbackListParams) => {
	return useSuspenseQuery(getFeedbackListOptions(listParams));
};
