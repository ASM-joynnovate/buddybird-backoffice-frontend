'use client';

import type { NotificationDispatchListParams } from '@/types/apis/notifications';

import { useGetNotificationDispatchList } from '@/hooks/apis/notifications';

interface Props {
	listParams: NotificationDispatchListParams;
}

/**
 * 조건에 맞는 발송 건수 컴포넌트
 * @param listParams 목록 조회 조건
 */
const DispatchResultCount = ({ listParams }: Props) => {
	const { data: dispatchListData } = useGetNotificationDispatchList(listParams);

	return (
		<span className="text-[13px] font-semibold whitespace-nowrap tabular-nums">
			{dispatchListData.meta.total_count.toLocaleString('ko-KR')}건
		</span>
	);
};

export default DispatchResultCount;
