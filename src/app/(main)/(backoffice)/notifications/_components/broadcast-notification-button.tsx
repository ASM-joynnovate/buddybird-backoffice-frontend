'use client';

import { useState } from 'react';

import BroadcastNotificationDialog from '@/app/(main)/(backoffice)/notifications/_components/broadcast-notification-dialog';

import { Button } from '@/components/ui/button';

/** 알림 일괄 발송 버튼 컴포넌트 */
const BroadcastNotificationButton = () => {
	const [broadcastDialogOpen, setBroadcastDialogOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setBroadcastDialogOpen(true)}>일괄 발송</Button>

			{broadcastDialogOpen && <BroadcastNotificationDialog onClose={() => setBroadcastDialogOpen(false)} />}
		</>
	);
};

export default BroadcastNotificationButton;
