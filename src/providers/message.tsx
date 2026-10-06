'use client';

import type { ReactNode } from 'react';

import { useMessageStore } from '@/providers/stores/message';

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
	children: ReactNode;
}

/**
 * 메시지 다이얼로그 provider
 * @param children 감싸는 내용
 */
const MessageProvider = ({ children }: Props) => {
	const message = useMessageStore((state) => state.message);
	const closePopup = useMessageStore((state) => state.closePopup);

	return (
		<>
			{children}

			<Dialog open={message !== null} onOpenChange={closePopup}>
				<DialogContent showCloseButton={false}>
					<DialogHeader>
						<DialogTitle>{message?.title}</DialogTitle>
						{!!message?.content && <DialogDescription>{message.content}</DialogDescription>}
					</DialogHeader>

					<DialogFooter>
						<Button onClick={closePopup}>확인</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default MessageProvider;
