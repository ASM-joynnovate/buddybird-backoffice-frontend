'use client';

import { useDeleteUser } from '@/hooks/apis/users';

import ConfirmDialog from '@/components/confirm-dialog';

interface Props {
	open: boolean;
	id: string;
	onClose: () => void;
}

/**
 * 사용자 삭제 다이얼로그 컴포넌트
 * @param open 다이얼로그 표시 여부
 * @param id 삭제할 사용자 ID
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const DeleteUserDialog = ({ open, id, onClose }: Props) => {
	const { isPending, mutate } = useDeleteUser();

	const handleDeleteUser = () => {
		if (isPending) {
			return;
		}

		mutate({ id }, { onSuccess: onClose });
	};

	return (
		<ConfirmDialog
			open={open}
			text={{ title: '사용자를 삭제할까요?', message: '삭제하면 되돌릴 수 없습니다.', confirm: '삭제' }}
			busy={isPending}
			onConfirm={handleDeleteUser}
			onClose={onClose}
		/>
	);
};

export default DeleteUserDialog;
