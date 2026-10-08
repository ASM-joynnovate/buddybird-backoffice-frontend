'use client';

import { type SubmitEvent, useState } from 'react';

import { useIsMutating } from '@tanstack/react-query';

import { apiKeys } from '@/hooks/apis/keys';
import { useSendNotification } from '@/hooks/apis/notifications';

import NotificationContentFields, {
	initialNotificationContent,
} from '@/app/(main)/(backoffice)/_components/notification-content-fields';
import NotificationPreview from '@/app/(main)/(backoffice)/_components/notification-preview';
import { UUID_PATTERN } from '@/config';
import { useMessageStore } from '@/providers/stores/message';
import { toI18nText } from '@/utils/i18n-text';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
	initialUserId?: string;
	onClose: () => void;
}

/**
 * 알림 개별 발송 다이얼로그 컴포넌트
 * @param initialUserId 처음에 채워 둘 사용자 ID
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const SendNotificationDialog = ({ initialUserId = '', onClose }: Props) => {
	const [userId, setUserId] = useState(initialUserId);
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
			<DialogContent className="gap-0 p-0 sm:max-w-280">
				<form onSubmit={handleSend}>
					<DialogHeader className="border-b px-6 py-4">
						<DialogTitle className="font-bold">알림 개별 발송</DialogTitle>
					</DialogHeader>

					<div className="grid md:min-h-140 md:grid-cols-[minmax(0,1fr)_420px]">
						{/*받는 사용자 및 알림 내용 입력*/}
						<div className="@container grid content-start gap-3 px-4 pt-5 pb-6 md:px-6">
							<div className="grid items-center gap-1.5 @md:grid-cols-[72px_minmax(0,1fr)] @md:gap-3">
								<Label htmlFor="user-id" className="text-[13px] font-semibold text-muted-foreground">
									받는 사용자
								</Label>
								<Input
									id="user-id"
									required
									pattern={UUID_PATTERN}
									title="UUID 형식으로 입력해 주세요."
									placeholder="사용자 ID"
									className="tabular-nums"
									value={userId}
									onChange={(event) => setUserId(event.target.value)}
								/>
							</div>

							<NotificationContentFields
								content={notificationContent}
								onContentChange={setNotificationContent}
							/>
						</div>

						<NotificationPreview content={notificationContent} />
					</div>

					<DialogFooter className="m-0 rounded-none border-t bg-card px-6 py-4">
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
