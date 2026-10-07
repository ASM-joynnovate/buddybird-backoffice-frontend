'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

interface Props {
	open: boolean;
	text: { title: string; message?: string; confirm: string };
	busy: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

/**
 * 확인 다이얼로그 컴포넌트
 * @param open 다이얼로그 표시 여부
 * @param text 다이얼로그 문구
 * @param busy 확인 요청 진행 여부
 * @param onConfirm 확인 버튼을 누를 때 실행할 함수
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const ConfirmDialog = ({ open, text, busy, onConfirm, onClose }: Props) => {
	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !busy) {
			onClose();
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>{text.title}</DialogTitle>
					{!!text.message && <DialogDescription>{text.message}</DialogDescription>}
				</DialogHeader>

				<DialogFooter>
					<Button variant="outline" disabled={busy} onClick={onClose}>
						취소
					</Button>
					<Button variant="destructive" disabled={busy} onClick={onConfirm}>
						{text.confirm}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmDialog;
