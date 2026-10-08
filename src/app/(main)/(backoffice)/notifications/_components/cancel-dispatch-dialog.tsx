'use client';

import type { NotificationDispatch } from '@/types/apis/notifications';

import { useCancelNotificationDispatch } from '@/hooks/apis/notifications';

import ConfirmDialog from '@/components/confirm-dialog';

interface Props {
	open: boolean;
	notificationDispatch: NotificationDispatch;
	onClose: () => void;
}

/**
 * 예약 취소 다이얼로그 컴포넌트
 * @param open 다이얼로그 표시 여부
 * @param notificationDispatch 취소할 발송
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const CancelDispatchDialog = ({ open, notificationDispatch, onClose }: Props) => {
	const { isPending, mutate } = useCancelNotificationDispatch();

	const scheduled = notificationDispatch.status === 'scheduled';

	const handleCancelDispatch = () => {
		if (isPending) {
			return;
		}

		mutate({ id: notificationDispatch.id }, { onSuccess: onClose });
	};

	return (
		<ConfirmDialog
			open={open}
			text={{
				title: scheduled ? '예약을 취소할까요?' : '남은 발송을 취소할까요?',
				message: '취소하면 되돌릴 수 없습니다.',
				confirm: scheduled ? '예약 취소' : '남은 발송 취소',
			}}
			busy={isPending}
			onConfirm={handleCancelDispatch}
			onClose={onClose}
		/>
	);
};

export default CancelDispatchDialog;
