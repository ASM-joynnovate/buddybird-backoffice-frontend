'use client';

import { useState } from 'react';

import { Send } from 'lucide-react';

import SendNotificationDialog from '@/app/(main)/(backoffice)/_components/send-notification-dialog';

import { Button } from '@/components/ui/button';

/** 알림 보내기 버튼 컴포넌트 */
const SendNotificationButton = () => {
	const [sendDialogOpen, setSendDialogOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setSendDialogOpen(true)}>
				<Send />
				알림 보내기
			</Button>

			{sendDialogOpen && <SendNotificationDialog onClose={() => setSendDialogOpen(false)} />}
		</>
	);
};

export default SendNotificationButton;
