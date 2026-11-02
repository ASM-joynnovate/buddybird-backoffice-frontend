'use client';

import type { Ad } from '@/types/apis/ads';

import { useDeleteAd } from '@/hooks/apis/ads';

import { koreanOrEnglishText } from '@/utils/i18n-text';

import ConfirmDialog from '@/components/confirm-dialog';

interface Props {
	open: boolean;
	ad: Ad;
	onClose: () => void;
	onDelete: () => void;
}

/**
 * 광고 삭제 다이얼로그 컴포넌트
 * @param open 다이얼로그 표시 여부
 * @param ad 삭제할 광고
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 * @param onDelete 삭제가 완료되면 실행할 함수
 */
const DeleteAdDialog = ({ open, ad, onClose, onDelete }: Props) => {
	const { isPending, mutate } = useDeleteAd();

	const handleDeleteAd = () => {
		if (isPending) {
			return;
		}

		mutate({ id: ad.id }, { onSuccess: onDelete });
	};

	return (
		<ConfirmDialog
			open={open}
			text={{ title: '광고를 삭제할까요?', message: koreanOrEnglishText(ad.advertiser_name), confirm: '삭제' }}
			busy={isPending}
			onConfirm={handleDeleteAd}
			onClose={onClose}
		/>
	);
};

export default DeleteAdDialog;
