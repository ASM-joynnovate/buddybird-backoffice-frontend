import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import {
	getNotificationAudience,
	getNotificationDispatch,
	getNotificationDispatchList,
	getNotificationList,
	getPushDeliveryList,
	postNotificationBroadcast,
	postNotificationDispatchCancel,
	postNotificationImage,
} from '@/apis/notifications';

import type {
	NotificationDispatchListParams,
	NotificationListParams,
	PushDeliveryListParams,
	SendableNotificationKind,
} from '@/types/apis/notifications';

import { apiKeys } from '@/hooks/apis/keys';

import { apiErrorMessage } from '@/lib/api';

import { NOTIFICATION_DISPATCH_REFETCH_INTERVAL_MS } from '@/config';
import { useMessageStore } from '@/providers/stores/message';

/** 알림 목록 조회 Hook에 사용할 옵션 */
export const getNotificationListOptions = (listParams: NotificationListParams) =>
	queryOptions({
		queryKey: apiKeys.notifications.list(listParams),
		queryFn: () => getNotificationList(listParams),
	});
/** 알림 목록 조회 Hook */
export const useGetNotificationList = (listParams: NotificationListParams) => {
	return useSuspenseQuery(getNotificationListOptions(listParams));
};

/** 발송 목록 조회 Hook에 사용할 옵션 */
export const getNotificationDispatchListOptions = (listParams: NotificationDispatchListParams) =>
	queryOptions({
		queryKey: apiKeys.notifications.dispatchList(listParams),
		queryFn: () => getNotificationDispatchList(listParams),
		// 발송 예정이 있을 때만 다시 조회
		refetchInterval: (query) =>
			query.state.data?.data.some((notificationDispatch) => notificationDispatch.status !== 'sent')
				? NOTIFICATION_DISPATCH_REFETCH_INTERVAL_MS
				: false,
	});
/** 발송 목록 조회 Hook */
export const useGetNotificationDispatchList = (listParams: NotificationDispatchListParams) => {
	return useSuspenseQuery(getNotificationDispatchListOptions(listParams));
};

/** 발송 상세 조회 Hook에 사용할 옵션 */
export const getNotificationDispatchOptions = ({ id }: { id: string }) =>
	queryOptions({
		queryKey: apiKeys.notifications.dispatchDetail(id),
		queryFn: () => getNotificationDispatch({ id }),
	});
/** 발송 상세 조회 Hook */
export const useGetNotificationDispatch = ({ id }: { id: string }) => {
	return useSuspenseQuery(getNotificationDispatchOptions({ id }));
};

/** 받는 사람 수 조회 Hook에 사용할 옵션 */
export const getNotificationAudienceOptions = ({ kind }: { kind: SendableNotificationKind }) =>
	queryOptions({
		queryKey: apiKeys.notifications.audience(kind),
		queryFn: () => getNotificationAudience({ kind }),
	});

/** 푸시 발송 기록 조회 Hook에 사용할 옵션 */
export const getPushDeliveryListOptions = (listParams: PushDeliveryListParams) =>
	queryOptions({
		queryKey: apiKeys.notifications.deliveryList(listParams),
		queryFn: () => getPushDeliveryList(listParams),
	});
/** 푸시 발송 기록 조회 Hook */
export const useGetPushDeliveryList = (listParams: PushDeliveryListParams) => {
	return useSuspenseQuery(getPushDeliveryListOptions(listParams));
};

/** 알림 발송 Hook */
export const useBroadcastNotification = () => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('notifications', 'broadcast'),
		mutationFn: postNotificationBroadcast,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: apiKeys.notifications.all() }),
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};

/** 예약 취소 Hook */
export const useCancelNotificationDispatch = () => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('notifications', 'dispatches', 'cancel'),
		mutationFn: postNotificationDispatchCancel,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: apiKeys.notifications.all() }),
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};

/** 알림 사진 업로드 Hook */
export const useUploadNotificationImage = () => {
	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('notifications', 'images', 'upload'),
		mutationFn: postNotificationImage,
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};
