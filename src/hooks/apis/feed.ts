import { useQueryClient } from '@tanstack/react-query';

import { postFeedItemHide } from '@/apis/feed';

import { apiKeys } from '@/hooks/apis/keys';
import { useIdempotentMutation } from '@/hooks/apis/use-idempotent-mutation';

import { apiErrorMessage } from '@/lib/api';

import { toast } from 'sonner';

/** 피드 항목 숨김 Hook */
export const useHideFeedItem = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('feed', 'hide'),
		mutationFn: postFeedItemHide,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.abuseReports.all() });

			toast.success('피드 항목을 숨겼습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};
