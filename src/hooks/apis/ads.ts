import { queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { deleteAd, getAdList, getAdStats, getAdTotalStats, patchAd, postAd, postAdImage, putAdOrder } from '@/apis/ads';

import type { AdListParams, AdStatsParams } from '@/types/apis/ads';

import { apiKeys } from '@/hooks/apis/keys';
import { useIdempotentMutation } from '@/hooks/apis/use-idempotent-mutation';

import { apiErrorMessage } from '@/lib/api';

import { toast } from 'sonner';

/** 광고 목록 조회 Hook에 사용할 옵션 */
export const getAdListOptions = (listParams: AdListParams) =>
	queryOptions({
		queryKey: apiKeys.ads.list(listParams),
		queryFn: () => getAdList(listParams),
	});
/** 광고 목록 조회 Hook */
export const useGetAdList = (listParams: AdListParams) => {
	return useSuspenseQuery(getAdListOptions(listParams));
};

/** 광고 통계 조회 Hook에 사용할 옵션 */
export const getAdStatsOptions = (id: string, statsParams: AdStatsParams) =>
	queryOptions({
		queryKey: apiKeys.ads.stats(id, statsParams),
		queryFn: () => getAdStats(id, statsParams),
	});
/** 광고 통계 조회 Hook */
export const useGetAdStats = (id: string, statsParams: AdStatsParams) => {
	return useSuspenseQuery(getAdStatsOptions(id, statsParams));
};

/** 전체 광고 통계 조회 Hook에 사용할 옵션 */
export const getAdTotalStatsOptions = (statsParams: AdStatsParams) =>
	queryOptions({
		queryKey: apiKeys.ads.totalStats(statsParams),
		queryFn: () => getAdTotalStats(statsParams),
	});
/** 전체 광고 통계 조회 Hook */
export const useGetAdTotalStats = (statsParams: AdStatsParams) => {
	return useSuspenseQuery(getAdTotalStatsOptions(statsParams));
};

/** 광고 생성 Hook */
export const useCreateAd = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('ads', 'create'),
		mutationFn: postAd,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.ads.all() });

			toast.success('광고를 작성했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 광고 수정 Hook */
export const useUpdateAd = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('ads', 'update'),
		mutationFn: patchAd,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.ads.all() });

			toast.success('광고를 수정했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 광고 삭제 Hook */
export const useDeleteAd = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('ads', 'delete'),
		mutationFn: deleteAd,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.ads.all() });

			toast.success('광고를 삭제했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 홈 배너 순서 변경 Hook */
export const useReorderHomeBanners = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('ads', 'order'),
		mutationFn: putAdOrder,
		onError: (error) => toast.error(apiErrorMessage(error)),
		// 다시 조회할 때까지 변경한 순서 표시
		onSettled: () => queryClient.invalidateQueries({ queryKey: apiKeys.ads.all() }),
	});
};

/** 광고 사진 업로드 Hook */
export const useUploadAdImage = () => {
	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('ads', 'images', 'upload'),
		mutationFn: postAdImage,
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};
