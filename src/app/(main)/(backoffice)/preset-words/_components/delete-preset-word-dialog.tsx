'use client';

import type { PresetWord } from '@/types/apis/preset-words';

import { useDeletePresetWord } from '@/hooks/apis/preset-words';

import { toPresetLanguageName } from '@/utils/locale';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent showCloseButton={false} className="p-5 sm:max-w-110">
				<DialogHeader>
					<DialogTitle className="font-bold">프리셋을 삭제할까요?</DialogTitle>
				</DialogHeader>

				<p className="flex items-center gap-2">
					<strong className="truncate font-semibold">{presetWord.name}</strong>
					<Badge className="rounded-sm bg-muted font-bold text-muted-foreground">
						{toPresetLanguageName(presetWord.language)}
					</Badge>
				</p>

				<p className="text-[12.5px] text-muted-foreground">이미 가입한 사용자의 단어는 삭제되지 않습니다.</p>

				<DialogFooter className="m-0 mt-1 flex-row justify-end border-0 bg-transparent p-0 *:flex-1 md:*:flex-none">
					<Button variant="outline" disabled={isPending} onClick={onClose}>
						취소
					</Button>
					<Button variant="destructive" disabled={isPending} onClick={handleDeletePresetWord}>
						삭제
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default DeletePresetWordDialog;
