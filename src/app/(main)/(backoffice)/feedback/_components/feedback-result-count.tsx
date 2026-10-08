'use client';

import type { FeedbackListParams } from '@/types/apis/feedback';

import { useGetFeedbackList } from '@/hooks/apis/feedback';

interface Props {
	listParams: FeedbackListParams;
}

/**
 * 조건에 맞는 피드백 건수 컴포넌트
 * @param listParams 목록 조회 조건
 */
const FeedbackResultCount = ({ listParams }: Props) => {
	const { data: feedbackListData } = useGetFeedbackList(listParams);

	return (
		<span className="text-[13px] font-semibold whitespace-nowrap tabular-nums">
			{feedbackListData.meta.total_count.toLocaleString('ko-KR')}건
		</span>
	);
};

export default FeedbackResultCount;
