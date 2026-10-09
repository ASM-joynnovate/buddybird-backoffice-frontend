import { queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { deleteConsent, getConsentList, patchConsent, postConsent } from '@/apis/consents';

import { apiKeys } from '@/hooks/apis/keys';
import { useIdempotentMutation } from '@/hooks/apis/use-idempotent-mutation';

import { apiErrorMessage } from '@/lib/api';

import { toast } from 'sonner';

/** 고지문 목록 조회 Hook에 사용할 옵션 */
export const getConsentListOptions = () => queryOptions({ queryKey: apiKeys.consents.all(), queryFn: getConsentList });
/** 고지문 목록 조회 Hook */
export const useGetConsentList = () => {
	return useSuspenseQuery(getConsentListOptions());
};

/** 고지문 생성 Hook */
export const useCreateConsent = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('consents', 'create'),
		mutationFn: postConsent,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.consents.all() });

			toast.success('고지문을 저장했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 고지문 수정 Hook */
export const useUpdateConsent = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('consents', 'update'),
		mutationFn: patchConsent,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.consents.all() });

			toast.success('고지문을 수정했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 고지문 삭제 Hook */
export const useDeleteConsent = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('consents', 'delete'),
		mutationFn: deleteConsent,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.consents.all() });

			toast.success('버전을 삭제했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};
