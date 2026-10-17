import { queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import {
	getNotificationSettingGroupList,
	getNotificationSettingItemList,
	patchNotificationSettingGroup,
	patchNotificationSettingItem,
	postNotificationSettingGroup,
	postNotificationSettingItem,
	putNotificationSettingGroupOrder,
	putNotificationSettingItemOrder,
} from '@/apis/notification-settings';

import { ApiError } from '@/types/apis/common';

import { apiKeys } from '@/hooks/apis/keys';
import { useIdempotentMutation } from '@/hooks/apis/use-idempotent-mutation';

import { apiErrorMessage } from '@/lib/api';

import { toast } from 'sonner';

/** 알림 설정 그룹 목록 조회 Hook에 사용할 옵션 */
export const getNotificationSettingGroupListOptions = () =>
	queryOptions({ queryKey: apiKeys.notificationSettings.groupList(), queryFn: getNotificationSettingGroupList });
/** 알림 설정 그룹 목록 조회 Hook */
export const useGetNotificationSettingGroupList = () => {
	return useSuspenseQuery(getNotificationSettingGroupListOptions());
};

/** 알림 설정 항목 목록 조회 Hook에 사용할 옵션 */
export const getNotificationSettingItemListOptions = () =>
	queryOptions({ queryKey: apiKeys.notificationSettings.itemList(), queryFn: getNotificationSettingItemList });
/** 알림 설정 항목 목록 조회 Hook */
export const useGetNotificationSettingItemList = () => {
	return useSuspenseQuery(getNotificationSettingItemListOptions());
};

/** 알림 설정 그룹 추가 Hook */
export const useCreateNotificationSettingGroup = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('notification-settings', 'groups', 'create'),
		mutationFn: postNotificationSettingGroup,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.notificationSettings.all() });

			toast.success('그룹을 추가했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 알림 설정 그룹 수정 Hook */
export const useUpdateNotificationSettingGroup = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('notification-settings', 'groups', 'update'),
		mutationFn: patchNotificationSettingGroup,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.notificationSettings.all() });

			toast.success('그룹을 수정했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 알림 설정 그룹 순서 변경 Hook */
export const useReorderNotificationSettingGroups = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('notification-settings', 'groups', 'order'),
		mutationFn: putNotificationSettingGroupOrder,
		onError: (error) => toast.error(apiErrorMessage(error)),
		// 다시 조회할 때까지 바꾼 순서 표시
		onSettled: () => queryClient.invalidateQueries({ queryKey: apiKeys.notificationSettings.all() }),
	});
};

/** 알림 설정 항목 추가 Hook */
export const useCreateNotificationSettingItem = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('notification-settings', 'items', 'create'),
		mutationFn: postNotificationSettingItem,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.notificationSettings.all() });

			toast.success('항목을 추가했습니다.');
		},
		onError: async (error) => {
			// 종류 중복은 다이얼로그에 표시
			if (error instanceof ApiError && error.code === 'NOTIFICATION_SETTING__DUPLICATE_KIND') {
				await queryClient.invalidateQueries({ queryKey: apiKeys.notificationSettings.itemList() });

				return;
			}

			toast.error(apiErrorMessage(error));
		},
	});
};

/** 알림 설정 항목 수정 Hook */
export const useUpdateNotificationSettingItem = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('notification-settings', 'items', 'update'),
		mutationFn: patchNotificationSettingItem,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.notificationSettings.all() });

			toast.success('항목을 수정했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 알림 설정 항목 순서 및 그룹 변경 Hook */
export const useReorderNotificationSettingItems = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('notification-settings', 'items', 'order'),
		mutationFn: putNotificationSettingItemOrder,
		onError: (error) => toast.error(apiErrorMessage(error)),
		// 다시 조회할 때까지 바꾼 순서 표시
		onSettled: () => queryClient.invalidateQueries({ queryKey: apiKeys.notificationSettings.all() }),
	});
};
