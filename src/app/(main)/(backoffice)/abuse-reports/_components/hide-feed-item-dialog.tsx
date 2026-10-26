'use client';

import { useHideFeedItem } from '@/hooks/apis/feed';

import ConfirmDialog from '@/components/confirm-dialog';

interface Props {
	open: boolean;
	id: string;
	onClose: () => void;
}

/**
 * 피드 항목 숨김 다이얼로그 컴포넌트
 * @param open 다이얼로그 표시 여부
 * @param id 숨길 피드 항목 ID
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const HideFeedItemDialog = ({ open, id, onClose }: Props) => {
	const { isPending, mutate } = useHideFeedItem();

	const handleHideFeedItem = () => {
		if (isPending) {
			return;
		}

		mutate({ id }, { onSuccess: onClose });
	};

	return (
		<ConfirmDialog
			open={open}
			text={{
				title: '피드 항목을 숨길까요?',
				message: '숨긴 항목은 다시 보이게 할 수 없습니다.',
				confirm: '숨기기',
			}}
			busy={isPending}
			onConfirm={handleHideFeedItem}
			onClose={onClose}
		/>
	);
};

export default HideFeedItemDialog;
