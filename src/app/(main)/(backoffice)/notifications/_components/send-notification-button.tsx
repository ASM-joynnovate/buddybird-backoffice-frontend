'use client';

import { useState } from 'react';

import { Send } from 'lucide-react';

import SendNotificationDialog from '@/app/(main)/(backoffice)/_components/send-notification-dialog';

import { Button } from '@/components/ui/button';

interface Props {
	className?: string;
}

/**
 * 알림 보내기 버튼 컴포넌트
 * @param className 버튼의 위치를 정하는 class
 */
const SendNotificationButton = ({ className }: Props) => {
	const [sendDialogOpen, setSendDialogOpen] = useState(false);

	return (
		<>
			<Button className={className} onClick={() => setSendDialogOpen(true)}>
				<Send />
				알림 보내기
			</Button>

			{sendDialogOpen && <SendNotificationDialog onClose={() => setSendDialogOpen(false)} />}
		</>
	);
};

export default SendNotificationButton;
