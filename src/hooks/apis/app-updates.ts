import { queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { getAppUpdateList, patchAppUpdate, postAppUpdate } from '@/apis/app-updates';

import type { Platform } from '@/types/apis/app-updates';

import { apiKeys } from '@/hooks/apis/keys';
import { useIdempotentMutation } from '@/hooks/apis/use-idempotent-mutation';

import { apiErrorMessage } from '@/lib/api';

import { toast } from 'sonner';

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

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('app-updates', 'create'),
		mutationFn: postAppUpdate,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.appUpdates.all() });

			toast.success('업데이트를 추가했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 앱 업데이트 수정 Hook */
export const useUpdateAppUpdate = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('app-updates', 'update'),
		mutationFn: patchAppUpdate,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.appUpdates.all() });

			toast.success('업데이트를 수정했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};
