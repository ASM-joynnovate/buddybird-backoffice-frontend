import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { notificationKindSchema } from '@/types/apis/notifications';
import { uuidSchema } from '@/types/apis/primitives';

import { getNotificationListOptions } from '@/hooks/apis/notifications';

import { getQueryClient } from '@/lib/query-client';

import BroadcastNotificationButton from '@/app/(main)/(backoffice)/notifications/_components/broadcast-notification-button';
import NotificationList from '@/app/(main)/(backoffice)/notifications/_components/notification-list';
import NotificationSearchForm from '@/app/(main)/(backoffice)/notifications/_components/notification-search-form';
import SendNotificationButton from '@/app/(main)/(backoffice)/notifications/_components/send-notification-button';
import { toPageNumber } from '@/utils/search-params';

import ContentSkeleton from '@/components/content-skeleton';
import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

/** 알림 발송 이력 페이지 */
export default async function Page(props: PageProps<'/notifications'>) {
	const searchParams = await props.searchParams;
	// 형식이 틀린 user_id 및 kind는 제외
	const listParams = {
		page: toPageNumber(searchParams.page),
		user_id: uuidSchema.safeParse(searchParams.user_id).data,
		kind: notificationKindSchema.safeParse(searchParams.kind).data,
	};

	const queryClient = getQueryClient();

	await queryClient.prefetchQuery(getNotificationListOptions(listParams));

	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">알림</h1>

				<div className="flex items-center gap-2">
					<SendNotificationButton />
					<BroadcastNotificationButton />
				</div>
			</div>

			{/*조회 조건이 바뀌면 다시 마운트*/}
			<NotificationSearchForm
				key={[listParams.user_id, listParams.kind].join(':')}
				user_id={listParams.user_id}
				kind={listParams.kind}
			/>

			<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<ContentSkeleton />>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<NotificationList listParams={listParams} />
				</HydrationBoundary>
			</ErrorHandlingWrapper>
		</>
	);
}
