'use client';

import type { Announcement } from '@/types/apis/announcements';

import { useDeleteAnnouncement } from '@/hooks/apis/announcements';

import { koreanOrEnglishText } from '@/utils/i18n-text';

import ConfirmDialog from '@/components/confirm-dialog';

interface Props {
	open: boolean;
	announcement: Announcement;
	onClose: () => void;
	onDelete: () => void;
}

/**
 * 공지 삭제 다이얼로그 컴포넌트
 * @param open 다이얼로그 표시 여부
 * @param announcement 삭제할 공지
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 * @param onDelete 삭제가 끝나면 실행할 함수
 */
const DeleteAnnouncementDialog = ({ open, announcement, onClose, onDelete }: Props) => {
	const { isPending, mutate } = useDeleteAnnouncement();

	const handleDeleteAnnouncement = () => {
		if (isPending) {
			return;
		}

		mutate({ id: announcement.id }, { onSuccess: onDelete });
	};

	return (
		<ConfirmDialog
			open={open}
			text={{ title: '공지를 삭제할까요?', message: koreanOrEnglishText(announcement.title), confirm: '삭제' }}
			busy={isPending}
			onConfirm={handleDeleteAnnouncement}
			onClose={onClose}
		/>
	);
};

export default DeleteAnnouncementDialog;
