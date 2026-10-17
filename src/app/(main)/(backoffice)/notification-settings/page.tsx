import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import {
	getNotificationSettingGroupListOptions,
	getNotificationSettingItemListOptions,
} from '@/hooks/apis/notification-settings';

import { getQueryClient } from '@/lib/query-client';

import NotificationSettings from '@/app/(main)/(backoffice)/notification-settings/_components/notification-settings';

/** 알림 설정 페이지 */
export default function Page() {
	const queryClient = getQueryClient();

	// 응답을 기다리지 않고 조회 시작
	void queryClient.prefetchQuery(getNotificationSettingGroupListOptions());
	void queryClient.prefetchQuery(getNotificationSettingItemListOptions());

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<NotificationSettings />
		</HydrationBoundary>
	);
}
