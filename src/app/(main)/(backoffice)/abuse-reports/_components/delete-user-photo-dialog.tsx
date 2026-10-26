'use client';

import { useDeleteUserPhoto } from '@/hooks/apis/users';

import ConfirmDialog from '@/components/confirm-dialog';

interface Props {
	open: boolean;
	id: string;
	onClose: () => void;
}

/**
 * 프로필 사진 삭제 다이얼로그 컴포넌트
 * @param open 다이얼로그 표시 여부
 * @param id 사진을 삭제할 사용자 ID
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const DeleteUserPhotoDialog = ({ open, id, onClose }: Props) => {
	const { isPending, mutate } = useDeleteUserPhoto();

	const handleDeleteUserPhoto = () => {
		if (isPending) {
			return;
		}

		mutate({ id }, { onSuccess: onClose });
	};

	return (
		<ConfirmDialog
			open={open}
			text={{
				title: '프로필 사진을 삭제할까요?',
				message: '삭제한 사진은 되돌릴 수 없습니다.',
				confirm: '삭제',
			}}
			busy={isPending}
			onConfirm={handleDeleteUserPhoto}
			onClose={onClose}
		/>
	);
};

export default DeleteUserPhotoDialog;
