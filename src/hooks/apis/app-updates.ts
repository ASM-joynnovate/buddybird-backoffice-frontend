import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { getAppUpdateList, patchAppUpdate, postAppUpdate } from '@/apis/app-updates';

import type { Platform } from '@/types/apis/app-updates';

import { apiKeys } from '@/hooks/apis/keys';

import { apiErrorMessage } from '@/lib/api';

import { useMessageStore } from '@/providers/stores/message';

/** 앱 업데이트 목록 조회 Hook에 사용할 옵션 */
export const getAppUpdateListOptions = ({ platform }: { platform: Platform }) =>
	queryOptions({ queryKey: apiKeys.appUpdates.list(platform), queryFn: () => getAppUpdateList({ platform }) });
/** 앱 업데이트 목록 조회 Hook */
export const useGetAppUpdateList = ({ platform }: { platform: Platform }) => {
	return useSuspenseQuery(getAppUpdateListOptions({ platform }));
};

/** 앱 업데이트 추가 Hook */
export const useCreateAppUpdate = () => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('app-updates', 'create'),
		mutationFn: postAppUpdate,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: apiKeys.appUpdates.all() }),
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};

/** 앱 업데이트 수정 Hook */
export const useUpdateAppUpdate = () => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('app-updates', 'update'),
		mutationFn: patchAppUpdate,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: apiKeys.appUpdates.all() }),
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};
