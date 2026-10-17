import { queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import {
	deleteAnnouncement,
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

/** 공지 사진 업로드 Hook */
export const useUploadAnnouncementImage = () => {
	return useIdempotentMutation({
		mutationKey: apiKeys.mutation('announcements', 'images', 'upload'),
		mutationFn: postAnnouncementImage,
		onError: (error) => toast.error(apiErrorMessage(error)),
	});
};
