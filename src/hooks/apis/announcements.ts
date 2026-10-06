import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import {
	deleteAnnouncement,
	deleteAnnouncementImage,
	getAnnouncementList,
	patchAnnouncement,
	postAnnouncement,
	postAnnouncementImage,
} from '@/apis/announcements';

import { apiKeys } from '@/hooks/apis/keys';

import { apiErrorMessage } from '@/lib/api';

import { useMessageStore } from '@/providers/stores/message';

/** 공지 목록 조회 Hook에 사용할 옵션 */
export const getAnnouncementListOptions = ({ page }: { page: number }) =>
	queryOptions({ queryKey: apiKeys.announcements.list(page), queryFn: () => getAnnouncementList({ page }) });
/** 공지 목록 조회 Hook */
export const useGetAnnouncementList = ({ page }: { page: number }) => {
	return useSuspenseQuery(getAnnouncementListOptions({ page }));
};

/** 공지 생성 Hook */
export const useCreateAnnouncement = () => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('announcements', 'create'),
		mutationFn: postAnnouncement,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: apiKeys.announcements.all() }),
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};

/** 공지 수정 Hook */
export const useUpdateAnnouncement = () => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('announcements', 'update'),
		mutationFn: patchAnnouncement,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: apiKeys.announcements.all() }),
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};

/** 공지 삭제 Hook */
export const useDeleteAnnouncement = () => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('announcements', 'delete'),
		mutationFn: deleteAnnouncement,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: apiKeys.announcements.all() }),
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};

/** 공지 사진 업로드 Hook */
export const useUploadAnnouncementImage = () => {
	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('announcements', 'images', 'upload'),
		mutationFn: postAnnouncementImage,
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};

/** 공지 사진 삭제 Hook */
export const useDeleteAnnouncementImage = () => {
	const queryClient = useQueryClient();

	const openPopup = useMessageStore((state) => state.openPopup);

	return useMutation({
		mutationKey: apiKeys.mutation('announcements', 'images', 'delete'),
		mutationFn: deleteAnnouncementImage,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: apiKeys.announcements.all() }),
		onError: (error) => openPopup({ title: apiErrorMessage(error) }),
	});
};
