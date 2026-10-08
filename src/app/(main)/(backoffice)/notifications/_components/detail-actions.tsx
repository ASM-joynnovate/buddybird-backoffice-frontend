'use client';

import { useState } from 'react';

import type { NotificationDispatch } from '@/types/apis/notifications';

import { Copy } from 'lucide-react';

import type { NotificationContent } from '@/app/(main)/(backoffice)/_components/notification-content-fields';
import SendNotificationDialog from '@/app/(main)/(backoffice)/_components/send-notification-dialog';
import CancelDispatchDialog from '@/app/(main)/(backoffice)/notifications/_components/cancel-dispatch-dialog';

import { Button } from '@/components/ui/button';

interface Props {
	copiedContent: NotificationContent;
	copiedUserId?: string;
	notificationDispatch?: NotificationDispatch;
}

/**
 * 펼친 상세 아래의 취소 및 다시 보내기 버튼 컴포넌트
 * @param copiedContent 다시 보낼 알림 내용
 * @param copiedUserId 다시 보낼 사용자 ID
 * @param notificationDispatch 취소할 수 있는 발송
 */
const DetailActions = ({ copiedContent, copiedUserId, notificationDispatch }: Props) => {
	const [sendDialogOpen, setSendDialogOpen] = useState(false);
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

	const cancelable = !!notificationDispatch && notificationDispatch.status !== 'sent';

	return (
		<footer className="col-span-full flex flex-wrap gap-2 border-t px-4 py-2.5">
			{cancelable && (
				<Button variant="destructive" size="sm" onClick={() => setCancelDialogOpen(true)}>
					{notificationDispatch.status === 'scheduled' ? '예약 취소' : '남은 발송 취소'}
				</Button>
			)}

			<Button variant="outline" size="sm" className="ml-auto" onClick={() => setSendDialogOpen(true)}>
				<Copy />
				같은 내용으로 보내기
			</Button>

			{sendDialogOpen && (
				<SendNotificationDialog
					initialContent={copiedContent}
					initialUserId={copiedUserId}
					onClose={() => setSendDialogOpen(false)}
				/>
			)}

			{cancelable && (
				<CancelDispatchDialog
					open={cancelDialogOpen}
					notificationDispatch={notificationDispatch}
					onClose={() => setCancelDialogOpen(false)}
				/>
			)}
		</footer>
	);
};

export default DetailActions;
