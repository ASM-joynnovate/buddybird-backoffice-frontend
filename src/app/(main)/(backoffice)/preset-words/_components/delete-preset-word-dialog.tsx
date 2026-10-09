'use client';

import type { PresetWord } from '@/types/apis/preset-words';

import { useDeletePresetWord } from '@/hooks/apis/preset-words';
import { useConfirmOnce } from '@/hooks/use-confirm-once';

import { toPresetLanguageName } from '@/utils/locale';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

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

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !isPending) {
			onClose();
		}
	};

	const handleDeletePresetWord = () => {
		if (isPending) {
			return;
		}

		mutate({ id: presetWord.id }, { onSuccess: onClose });
	};

	const handleConfirm = useConfirmOnce(handleDeletePresetWord, open, isPending);

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			<AlertDialogContent className="gap-0 p-0 data-[size=default]:max-w-[calc(100%-2rem)] data-[size=default]:sm:max-w-110">
				<AlertDialogHeader className="place-items-start gap-0 border-b px-4 py-3 text-left">
					<AlertDialogTitle className="font-bold">프리셋을 삭제할까요?</AlertDialogTitle>
				</AlertDialogHeader>

				<div className="grid gap-4 p-4">
					<p className="flex items-center gap-2">
						<strong className="truncate font-semibold">{presetWord.name}</strong>
						<Badge variant="muted">{toPresetLanguageName(presetWord.language)}</Badge>
					</p>

					<p className="text-[12.5px] text-muted-foreground">
						이미 가입한 사용자의 단어는 삭제되지 않습니다.
					</p>
				</div>

				<AlertDialogFooter className="m-0 bg-card px-4 py-3">
					<AlertDialogCancel disabled={isPending}>취소</AlertDialogCancel>
					<AlertDialogAction variant="destructive" loading={isPending} onClick={handleConfirm}>
						삭제
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeletePresetWordDialog;
