import { queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { deletePresetWord, getPresetWordList, patchPresetWord, postPresetWord } from '@/apis/preset-words';

import { apiKeys } from '@/hooks/apis/keys';
import { useIdempotentMutation } from '@/hooks/apis/use-idempotent-mutation';

import { apiErrorMessage } from '@/lib/api';

import { toast } from 'sonner';

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

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('preset-words', 'create'),
		mutationFn: postPresetWord,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.presetWords.all() });

			toast.success('프리셋을 추가했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 단어 프리셋 수정 Hook */
export const useUpdatePresetWord = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('preset-words', 'update'),
		mutationFn: patchPresetWord,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.presetWords.all() });

			toast.success('프리셋을 수정했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 단어 프리셋 삭제 Hook */
export const useDeletePresetWord = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('preset-words', 'delete'),
		mutationFn: deletePresetWord,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.presetWords.all() });

			toast.success('프리셋을 삭제했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};
