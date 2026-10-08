'use client';

import { type ChangeEvent, type SubmitEvent, useState } from 'react';

import { useIsMutating } from '@tanstack/react-query';

import { uuidSchema } from '@/types/apis/primitives';

import { apiKeys } from '@/hooks/apis/keys';
import { useBroadcastNotification } from '@/hooks/apis/notifications';

import NotificationContentFields, {
	initialNotificationContent,
} from '@/app/(main)/(backoffice)/_components/notification-content-fields';
import { BROADCAST_MAX_USER_COUNT } from '@/config';
import { useMessageStore } from '@/providers/stores/message';
import { toLocalDateTime } from '@/utils/date';
import { toI18nText } from '@/utils/i18n-text';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
	onClose: () => void;
}

/**
 * 알림 일괄 발송 다이얼로그 컴포넌트
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const BroadcastNotificationDialog = ({ onClose }: Props) => {
	const [allUsersSelected, setAllUsersSelected] = useState(false);
	const [userIdsText, setUserIdsText] = useState('');
	const [recipientLocalDatetime, setRecipientLocalDatetime] = useState('');
	const [notificationContent, setNotificationContent] = useState(initialNotificationContent);
	const [userIdCountInvalid, setUserIdCountInvalid] = useState(false);
	const [userIdFormatInvalid, setUserIdFormatInvalid] = useState(false);

	const { isPending, mutate } = useBroadcastNotification();

	const imageUploading = useIsMutating({ mutationKey: apiKeys.mutation('notifications', 'images', 'upload') }) > 0;

	const openPopup = useMessageStore((state) => state.openPopup);

	const urgentKindSelected = notificationContent.kind === 'urgent';

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !isPending) {
			onClose();
		}
	};

	const handleAllUsersChange = (checked: boolean) => {
		setAllUsersSelected(checked);
		setUserIdCountInvalid(false);
		setUserIdFormatInvalid(false);
	};

	const handleUserIdsTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		setUserIdsText(event.target.value);
		setUserIdCountInvalid(false);
		setUserIdFormatInvalid(false);
	};

	const handleBroadcast = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (isPending || imageUploading || !notificationContent.kind) {
			return;
		}

		const userIds = userIdsText
			.split('\n')
			.map((userId) => userId.trim())
			.filter((userId) => !!userId);
		const nextUserIdCountInvalid = userIds.length === 0 || userIds.length > BROADCAST_MAX_USER_COUNT;
		const nextUserIdFormatInvalid = userIds.some((userId) => !uuidSchema.safeParse(userId).success);

		if (!allUsersSelected && (nextUserIdCountInvalid || nextUserIdFormatInvalid)) {
			setUserIdCountInvalid(nextUserIdCountInvalid);
			setUserIdFormatInvalid(nextUserIdFormatInvalid);

			return;
		}

		mutate(
			{
				data: {
					kind: notificationContent.kind,
					title: toI18nText(notificationContent.title),
					body: toI18nText(notificationContent.body),
					image_file_id: notificationContent.imageFileId,
					...(allUsersSelected ? { all_users: true } : { user_ids: userIds, all_users: false }),
					recipient_local_datetime:
						!urgentKindSelected && !!recipientLocalDatetime
							? toLocalDateTime(recipientLocalDatetime)
							: null,
				},
			},
			{
				onSuccess: (broadcastResult) => {
					openPopup({ title: `${broadcastResult.notification_count}건의 알림을 만들었습니다.` });

					onClose();
				},
			},
		);
	};

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<DialogContent>
				<form onSubmit={handleBroadcast} className="space-y-4">
					<DialogHeader>
						<DialogTitle>알림 일괄 발송</DialogTitle>
					</DialogHeader>

					<div className="flex items-center gap-2">
						<Checkbox id="all-users" checked={allUsersSelected} onCheckedChange={handleAllUsersChange} />
						<Label htmlFor="all-users">전체 사용자</Label>
					</div>

					<div className="space-y-2">
						<Label htmlFor="user-ids">사용자 ID 목록</Label>
						<Textarea
							id="user-ids"
							required
							disabled={allUsersSelected}
							placeholder="한 줄에 하나씩 입력"
							value={userIdsText}
							aria-invalid={userIdCountInvalid || userIdFormatInvalid}
							onChange={handleUserIdsTextChange}
						/>
						{userIdCountInvalid && (
							<p role="alert" className="text-sm text-destructive">
								사용자 ID는 1개 이상 {BROADCAST_MAX_USER_COUNT}개 이하로 입력해야 합니다.
							</p>
						)}
						{userIdFormatInvalid && (
							<p role="alert" className="text-sm text-destructive">
								사용자 ID는 UUID 형식으로 입력해야 합니다.
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="recipient-local-datetime">수신자 현지 시각</Label>
						<Input
							id="recipient-local-datetime"
							type="datetime-local"
							disabled={urgentKindSelected}
							value={recipientLocalDatetime}
							onChange={(event) => setRecipientLocalDatetime(event.target.value)}
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

export default BroadcastNotificationDialog;
