import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { deleteConsent, getConsentList, patchConsent, postConsent } from '@/apis/consents';

import { apiKeys } from '@/hooks/apis/keys';

import { apiErrorMessage } from '@/lib/api';

import { useMessageStore } from '@/providers/stores/message';

/** 고지문 목록 조회 Hook에 사용할 옵션 */
export const getConsentListOptions = () => queryOptions({ queryKey: apiKeys.consents.all(), queryFn: getConsentList });
/** 고지문 목록 조회 Hook */
export const useGetConsentList = () => {
	return useSuspenseQuery(getConsentListOptions());
};

/** 고지문 생성 Hook */
export const useCreateConsent = () => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('consents', 'create'),
		mutationFn: postConsent,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: apiKeys.consents.all() }),
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};

/** 고지문 수정 Hook */
export const useUpdateConsent = () => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('consents', 'update'),
		mutationFn: patchConsent,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: apiKeys.consents.all() }),
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};

/** 고지문 삭제 Hook */
export const useDeleteConsent = () => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('consents', 'delete'),
		mutationFn: deleteConsent,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: apiKeys.consents.all() }),
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};
