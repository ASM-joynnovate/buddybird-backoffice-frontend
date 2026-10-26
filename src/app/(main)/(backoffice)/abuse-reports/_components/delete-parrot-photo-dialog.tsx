'use client';

import { useDeleteUserParrotPhoto } from '@/hooks/apis/users';

import ConfirmDialog from '@/components/confirm-dialog';

interface Props {
	open: boolean;
	userId: string;
	parrotId: string;
	onClose: () => void;
}

/**
 * 앵무새 사진 삭제 다이얼로그 컴포넌트
 * @param open 다이얼로그 표시 여부
 * @param userId 앵무새를 등록한 사용자 ID
 * @param parrotId 사진을 삭제할 앵무새 ID
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const DeleteParrotPhotoDialog = ({ open, userId, parrotId, onClose }: Props) => {
	const { isPending, mutate } = useDeleteUserParrotPhoto();

	const handleDeleteParrotPhoto = () => {
		if (isPending) {
			return;
		}

		mutate({ id: userId, parrotId }, { onSuccess: onClose });
	};

	return (
		<ConfirmDialog
			open={open}
			text={{
				title: '앵무새 사진을 삭제할까요?',
				message: '삭제한 사진은 되돌릴 수 없습니다.',
				confirm: '삭제',
			}}
			busy={isPending}
			onConfirm={handleDeleteParrotPhoto}
			onClose={onClose}
		/>
	);
};

export default DeleteParrotPhotoDialog;
