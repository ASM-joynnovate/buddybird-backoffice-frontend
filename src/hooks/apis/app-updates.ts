import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { getAppUpdate, putAppUpdate } from '@/apis/app-updates';

import type { Platform } from '@/types/apis/app-updates';

import { apiKeys } from '@/hooks/apis/keys';

import { apiErrorMessage } from '@/lib/api';

import { useMessageStore } from '@/providers/stores/message';

/** 앱 업데이트 정보 조회 Hook에 사용할 옵션 */
export const getAppUpdateOptions = ({ platform }: { platform: Platform }) =>
	queryOptions({ queryKey: apiKeys.appUpdates.detail(platform), queryFn: () => getAppUpdate({ platform }) });
/** 앱 업데이트 정보 조회 Hook */
export const useGetAppUpdate = ({ platform }: { platform: Platform }) => {
	return useSuspenseQuery(getAppUpdateOptions({ platform }));
};

/** 앱 업데이트 정보 저장 Hook */
export const useSaveAppUpdate = () => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('app-updates', 'save'),
		mutationFn: putAppUpdate,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.appUpdates.all() });

			openPopup({ title: '저장했습니다.' });
		},
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};
