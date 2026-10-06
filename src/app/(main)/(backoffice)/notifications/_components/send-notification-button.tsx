'use client';

import { useState } from 'react';

import SendNotificationDialog from '@/app/(main)/(backoffice)/notifications/_components/send-notification-dialog';

import { Button } from '@/components/ui/button';

/** 알림 개별 발송 버튼 컴포넌트 */
const SendNotificationButton = () => {
	const [sendDialogOpen, setSendDialogOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setSendDialogOpen(true)}>개별 발송</Button>

			{sendDialogOpen && <SendNotificationDialog onClose={() => setSendDialogOpen(false)} />}
		</>
	);
};

export default SendNotificationButton;
