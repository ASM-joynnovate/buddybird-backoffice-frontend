import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import {
	getNotificationList,
	getPushDeliveryList,
	postNotification,
	postNotificationBroadcast,
	postNotificationImage,
} from '@/apis/notifications';

import type { NotificationListParams, PushDeliveryListParams } from '@/types/apis/notifications';

import { apiKeys } from '@/hooks/apis/keys';

import { apiErrorMessage } from '@/lib/api';

import { useMessageStore } from '@/providers/stores/message';

/** 알림 발송 이력 조회 Hook에 사용할 옵션 */
export const getNotificationListOptions = (listParams: NotificationListParams) =>
	queryOptions({
		queryKey: apiKeys.notifications.list(listParams),
		queryFn: () => getNotificationList(listParams),
	});
/** 알림 발송 이력 조회 Hook */
export const useGetNotificationList = (listParams: NotificationListParams) => {
	return useSuspenseQuery(getNotificationListOptions(listParams));
};

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
export const useSendNotification = () => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('notifications', 'send'),
		mutationFn: postNotification,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: apiKeys.notifications.all() }),
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};

/** 알림 일괄 발송 Hook */
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

/** 알림 사진 업로드 Hook */
export const useUploadNotificationImage = () => {
	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('notifications', 'images', 'upload'),
		mutationFn: postNotificationImage,
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};
