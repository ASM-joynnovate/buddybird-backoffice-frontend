'use client';

import type { PresetWord } from '@/types/apis/preset-words';

import { useDeletePresetWord } from '@/hooks/apis/preset-words';

import ConfirmDialog from '@/components/confirm-dialog';

interface Props {
	open: boolean;
	presetWord: PresetWord;
	onClose: () => void;
}

/**
 * 단어 프리셋 삭제 다이얼로그 컴포넌트
 * @param open 다이얼로그 표시 여부
 * @param presetWord 삭제할 단어 프리셋
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const DeletePresetWordDialog = ({ open, presetWord, onClose }: Props) => {
	const { isPending, mutate } = useDeletePresetWord();

	const handleDeletePresetWord = () => {
		if (isPending) {
			return;
		}

		mutate({ id: presetWord.id }, { onSuccess: onClose });
	};

	return (
		<ConfirmDialog
			open={open}
			text={{ title: '단어 프리셋을 삭제할까요?', message: presetWord.name, confirm: '삭제' }}
			busy={isPending}
			onConfirm={handleDeletePresetWord}
			onClose={onClose}
		/>
	);
};

export default DeletePresetWordDialog;
