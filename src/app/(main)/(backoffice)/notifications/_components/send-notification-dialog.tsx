'use client';

import { type SubmitEvent, useState } from 'react';

import { useIsMutating } from '@tanstack/react-query';

import { apiKeys } from '@/hooks/apis/keys';
import { useSendNotification } from '@/hooks/apis/notifications';

import NotificationContentFields, {
	initialNotificationContent,
} from '@/app/(main)/(backoffice)/notifications/_components/notification-content-fields';
import { UUID_PATTERN } from '@/config';
import { useMessageStore } from '@/providers/stores/message';
import { toI18nText } from '@/utils/i18n-text';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
	onClose: () => void;
}

/**
 * 알림 개별 발송 다이얼로그 컴포넌트
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const SendNotificationDialog = ({ onClose }: Props) => {
	const [userId, setUserId] = useState('');
	const [notificationContent, setNotificationContent] = useState(initialNotificationContent);

	const { isPending, mutate } = useSendNotification();

	const imageUploading = useIsMutating({ mutationKey: apiKeys.mutation('notifications', 'images', 'upload') }) > 0;

	const openPopup = useMessageStore((state) => state.openPopup);

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !isPending) {
			onClose();
		}
	};

	const handleSend = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (isPending || imageUploading || !notificationContent.kind) {
			return;
		}

		mutate(
			{
				data: {
					user_id: userId.trim(),
					kind: notificationContent.kind,
					title: toI18nText(notificationContent.title),
					body: toI18nText(notificationContent.body),
					image_file_id: notificationContent.imageFileId,
				},
			},
			{
				onSuccess: (notification) => {
					if (!notification) {
						openPopup({ title: '수신자의 알림 설정이 꺼져 있어 발송하지 않았습니다.' });

						return;
					}

					onClose();
				},
			},
		);
	};

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<DialogContent>
				<form onSubmit={handleSend} className="space-y-4">
					<DialogHeader>
						<DialogTitle>알림 개별 발송</DialogTitle>
					</DialogHeader>

					<div className="space-y-2">
						<Label htmlFor="user-id">사용자 ID</Label>
						<Input
							id="user-id"
							required
							pattern={UUID_PATTERN}
							title="UUID 형식으로 입력해 주세요."
							value={userId}
							onChange={(event) => setUserId(event.target.value)}
						/>
					</div>

					<NotificationContentFields content={notificationContent} onContentChange={setNotificationContent} />

					<DialogFooter>
						<Button type="button" variant="outline" disabled={isPending} onClick={onClose}>
							취소
						</Button>
						<Button type="submit" disabled={isPending || imageUploading}>
							발송
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default SendNotificationDialog;
