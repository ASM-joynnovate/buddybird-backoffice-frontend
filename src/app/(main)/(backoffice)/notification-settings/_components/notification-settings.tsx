import AddNotificationSettingGroupButton from '@/app/(main)/(backoffice)/notification-settings/_components/add-notification-setting-group-button';
import AddNotificationSettingItemButton from '@/app/(main)/(backoffice)/notification-settings/_components/add-notification-setting-item-button';
import NotificationSettingTableCard from '@/app/(main)/(backoffice)/notification-settings/_components/notification-setting-table-card';
import NotificationSettingTableSkeleton from '@/app/(main)/(backoffice)/notification-settings/_components/notification-setting-table-skeleton';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

/** 알림 설정 화면 컴포넌트 */
const NotificationSettings = () => {
	return (
		<>
			<div className="flex flex-wrap items-center gap-2">
				<h1 className="mr-auto text-2xl font-bold">알림 설정</h1>

				{/*좁은 화면에서는 다음 줄에 같은 폭으로 표시*/}
				<div className="flex gap-2 max-md:w-full max-md:*:flex-1">
					<AddNotificationSettingGroupButton />

					<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback={null}>
						<AddNotificationSettingItemButton />
					</ErrorHandlingWrapper>
				</div>
			</div>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<NotificationSettingTableSkeleton />>
				<NotificationSettingTableCard />
			</ErrorHandlingWrapper>
		</>
	);
};

export default NotificationSettings;
