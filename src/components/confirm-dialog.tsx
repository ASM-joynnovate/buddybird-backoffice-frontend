'use client';

import { useConfirmOnce } from '@/hooks/use-confirm-once';

import { cn } from '@/lib/utils';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Props {
	open: boolean;
	text: { title: string; message?: string; confirm: string };
	confirmVariant?: 'default' | 'destructive';
	busy: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

/**
 * 확인 다이얼로그 컴포넌트
 * @param open 다이얼로그 표시 여부
 * @param text 다이얼로그 문구
 * @param confirmVariant 확인 버튼의 모양
 * @param busy 확인 요청 진행 여부
 * @param onConfirm 확인 버튼을 누를 때 실행할 함수
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const ConfirmDialog = ({ open, text, confirmVariant = 'destructive', busy, onConfirm, onClose }: Props) => {
	const handleConfirm = useConfirmOnce(onConfirm, open, busy);

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !busy) {
			onClose();
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={handleOpenChange}>
			<AlertDialogContent className="gap-0 p-0">
				<AlertDialogHeader className="place-items-start gap-0 border-b px-4 py-3 text-left">
					<AlertDialogTitle className="font-bold">{text.title}</AlertDialogTitle>
				</AlertDialogHeader>

				{!!text.message && <AlertDialogDescription className="p-4">{text.message}</AlertDialogDescription>}

				{/*문구가 없으면 제목 아래 선만 표시*/}
				<AlertDialogFooter className={cn('m-0 bg-card px-4 py-3', !text.message && 'border-t-0')}>
					<AlertDialogCancel disabled={busy}>취소</AlertDialogCancel>
					<AlertDialogAction variant={confirmVariant} loading={busy} onClick={handleConfirm}>
						{text.confirm}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default ConfirmDialog;
