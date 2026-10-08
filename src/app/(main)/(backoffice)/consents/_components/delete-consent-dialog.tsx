'use client';

import { useRouter } from 'next/navigation';

import type { Consent } from '@/types/apis/consents';

import { useDeleteConsent } from '@/hooks/apis/consents';

import { koreanOrEnglishText } from '@/utils/i18n-text';

import ConfirmDialog from '@/components/confirm-dialog';

interface Props {
	open: boolean;
	consent: Consent;
	onClose: () => void;
}

/**
 * 고지문 삭제 다이얼로그 컴포넌트
 * @param open 다이얼로그 표시 여부
 * @param consent 삭제할 고지문
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const DeleteConsentDialog = ({ open, consent, onClose }: Props) => {
	const router = useRouter();

	const { isPending, mutate } = useDeleteConsent();

	const handleDeleteConsent = () => {
		if (isPending) {
			return;
		}

		mutate(
			{ id: consent.id },
			{
				onSuccess: () => {
					onClose();

					// 같은 종류의 대표하는 버전을 고름
					router.push(`/consents?${new URLSearchParams({ kind: consent.kind })}`, { scroll: false });
				},
			},
		);
	};

	return (
		<ConfirmDialog
			open={open}
			text={{
				title: '이 버전을 삭제할까요?',
				message: `${koreanOrEnglishText(consent.title)} 버전 ${consent.version}`,
				confirm: '삭제',
			}}
			busy={isPending}
			onConfirm={handleDeleteConsent}
			onClose={onClose}
		/>
	);
};

export default DeleteConsentDialog;
