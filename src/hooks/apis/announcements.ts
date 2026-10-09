import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import {
	deleteAnnouncement,
	deleteAnnouncementImage,
	getAnnouncementList,
	patchAnnouncement,
	postAnnouncement,
	postAnnouncementImage,
} from '@/apis/announcements';

import type { AnnouncementListParams } from '@/types/apis/announcements';

import { apiKeys } from '@/hooks/apis/keys';
import { useIdempotentMutation } from '@/hooks/apis/use-idempotent-mutation';

import { apiErrorMessage } from '@/lib/api';

import { toast } from 'sonner';

/** 공지 목록 조회 Hook에 사용할 옵션 */
export const getAnnouncementListOptions = (listParams: AnnouncementListParams) =>
	queryOptions({
		queryKey: apiKeys.announcements.list(listParams),
		queryFn: () => getAnnouncementList(listParams),
	});
/** 공지 목록 조회 Hook */
export const useGetAnnouncementList = (listParams: AnnouncementListParams) => {
	return useSuspenseQuery(getAnnouncementListOptions(listParams));
};

/** 공지 생성 Hook */
export const useCreateAnnouncement = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('announcements', 'create'),
		mutationFn: postAnnouncement,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.announcements.all() });

			toast.success('공지를 작성했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 공지 수정 Hook */
export const useUpdateAnnouncement = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('announcements', 'update'),
		mutationFn: patchAnnouncement,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.announcements.all() });

			toast.success('공지를 수정했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 공지 삭제 Hook */
export const useDeleteAnnouncement = () => {
	const queryClient = useQueryClient();

	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('announcements', 'delete'),
		mutationFn: deleteAnnouncement,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: apiKeys.announcements.all() });

			toast.success('공지를 삭제했습니다.');
		},
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};

/** 공지 사진 삭제 및 업로드 Hook */
export const useSaveAnnouncementImages = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationKey: apiKeys.mutation('announcements', 'images', 'save'),
		mutationFn: async ({
			id,
			deletedImages,
			addedImages,
		}: {
			id: string;
			deletedImages: { imageId: string; idempotencyKey: string }[];
			addedImages: { file: File; idempotencyKey: string }[];
		}) => {
			for (const { imageId, idempotencyKey } of deletedImages) {
				await deleteAnnouncementImage({ id, imageId, idempotencyKey });
			}

			// 고른 순서대로 업로드
			for (const { file, idempotencyKey } of addedImages) {
				await postAnnouncementImage({ id, file, idempotencyKey });
			}
		},
		onError: () =>
			toast.error('사진을 저장하지 못했습니다.', {
				description: '공지 내용은 저장됐습니다. 공지를 다시 열어 사진을 확인해 주세요.',
			}),
		onSettled: () => queryClient.invalidateQueries({ queryKey: apiKeys.announcements.all() }),
	});
};
