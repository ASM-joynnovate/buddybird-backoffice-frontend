import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { deletePresetWord, getPresetWordList, patchPresetWord, postPresetWord } from '@/apis/preset-words';

import { apiKeys } from '@/hooks/apis/keys';

import { apiErrorMessage } from '@/lib/api';

import { useMessageStore } from '@/providers/stores/message';

/** 단어 프리셋 목록 조회 Hook에 사용할 옵션 */
export const getPresetWordListOptions = () =>
	queryOptions({ queryKey: apiKeys.presetWords.all(), queryFn: getPresetWordList });
/** 단어 프리셋 목록 조회 Hook */
export const useGetPresetWordList = () => {
	return useSuspenseQuery(getPresetWordListOptions());
};

/** 단어 프리셋 생성 Hook */
export const useCreatePresetWord = () => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('preset-words', 'create'),
		mutationFn: postPresetWord,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: apiKeys.presetWords.all() }),
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};

/** 단어 프리셋 수정 Hook */
export const useUpdatePresetWord = () => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('preset-words', 'update'),
		mutationFn: patchPresetWord,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: apiKeys.presetWords.all() }),
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};

/** 단어 프리셋 삭제 Hook */
export const useDeletePresetWord = () => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('preset-words', 'delete'),
		mutationFn: deletePresetWord,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: apiKeys.presetWords.all() }),
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};
