'use client';

import type { NotificationListParams } from '@/types/apis/notifications';

import { useGetNotificationList } from '@/hooks/apis/notifications';

interface Props {
	listParams: NotificationListParams;
}

/**
 * 조건에 맞는 알림 건수 컴포넌트
 * @param listParams 목록 조회 조건
 */
const NotificationResultCount = ({ listParams }: Props) => {
	const { data: notificationListData } = useGetNotificationList(listParams);

	return (
		<span className="text-[13px] font-semibold whitespace-nowrap tabular-nums">
			{notificationListData.meta.total_count.toLocaleString('ko-KR')}건
		</span>
	);
};

export default NotificationResultCount;
