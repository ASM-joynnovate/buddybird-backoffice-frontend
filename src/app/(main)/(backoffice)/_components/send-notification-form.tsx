'use client';

import { type SubmitEvent, useDeferredValue, useId, useState } from 'react';

import { useSuspenseQueries } from '@tanstack/react-query';

import type { UserListItem } from '@/types/apis/users';

import {
	getNotificationAudienceOptions,
	useBroadcastNotification,
	useUploadNotificationImage,
} from '@/hooks/apis/notifications';
import { getUserListOptions } from '@/hooks/apis/users';

import DateTimePicker from '@/app/(main)/(backoffice)/_components/date-time-picker';
import FunnelRows from '@/app/(main)/(backoffice)/_components/funnel-rows';
import NotificationContentFields, {
	type NotificationContent,
} from '@/app/(main)/(backoffice)/_components/notification-content-fields';
import { NOTIFICATION_KINDS } from '@/app/(main)/(backoffice)/_components/notification-kind-tag';
import NotificationPreview from '@/app/(main)/(backoffice)/_components/notification-preview';
import NotificationReachIcon from '@/app/(main)/(backoffice)/_components/notification-reach-icon';
import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';
import UserPicker from '@/app/(main)/(backoffice)/_components/user-picker';
import { BROADCAST_MAX_USER_COUNT } from '@/config';
import { AUDIENCE_HELP_TEXTS } from '@/config/notification';
import { toLocalDateTime } from '@/utils/date';
import { toI18nText } from '@/utils/i18n-text';
import { receivesNotification, toSentText } from '@/utils/notification';

import ConfirmDialog from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

const RECIPIENT_TARGETS = [
	{ target: 'all', label: '전체' },
	{ target: 'selected', label: '선택' },
] as const;

const rowClassName = 'grid gap-1.5 @md:grid-cols-[72px_minmax(0,1fr)] @md:gap-3';
const labelClassName = 'text-[13px] font-semibold text-muted-foreground';

interface Props {
	initialContent: NotificationContent;
	initialUserIds: string[];
	onClose: () => void;
}

/**
 * 알림 보내기 입력 및 미리보기 컴포넌트
 * @param initialContent 처음에 채워 둘 알림 내용
 * @param initialUserIds 처음에 고를 사용자 ID
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const SendNotificationForm = ({ initialContent, initialUserIds, onClose }: Props) => {
	const initialUsers = useSuspenseQueries({
		queries: (initialUserIds.length > 0 ? [initialUserIds] : []).map((userIds) =>
			getUserListOptions({ page: 1, user_ids: userIds }),
		),
		combine: (results) => results.flatMap((result) => result.data.data),
	});

	const broadcastNotification = useBroadcastNotification();
	const uploadNotificationImage = useUploadNotificationImage();

	const [target, setTarget] = useState<'all' | 'selected'>(initialUsers.length > 0 ? 'selected' : 'all');
	const [selectedUsers, setSelectedUsers] = useState<UserListItem[]>(initialUsers);
	const [content, setContent] = useState(initialContent);
	const [scheduled, setScheduled] = useState(false);
	const [recipientLocalDatetime, setRecipientLocalDatetime] = useState('');
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

	const scheduleLabelId = useId();

	// 새 값을 불러오는 동안 이전 인원 표시
	const audienceKind = useDeferredValue(target === 'all' ? content.kind : null);
	const audience = useSuspenseQueries({
		queries: (audienceKind ? [audienceKind] : []).map((kind) => getNotificationAudienceOptions({ kind })),
		combine: (results) => results[0]?.data,
	});

	const urgent = content.kind === 'urgent';
	const scheduleOn = scheduled && !urgent;
	const receivers = selectedUsers.filter((user) => receivesNotification(user, content.kind));
	const reachCounts = audience
		? [audience.user_count, audience.recipient_count, audience.pushable_count]
		: [selectedUsers.length, receivers.length, receivers.filter((user) => user.is_pushable).length];
	const recipientCount = reachCounts[1];
	const sending = uploadNotificationImage.isPending || broadcastNotification.isPending;

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (sending || recipientCount === 0) {
			return;
		}

		setConfirmDialogOpen(true);
	};

	/** 사진 파일 ID를 넣어 알림 발송 */
	const broadcast = (imageFileId: string | null) => {
		broadcastNotification.mutate(
			{
				data: {
					kind: content.kind,
					title: toI18nText(content.title),
					body: toI18nText(content.body),
					image_file_id: imageFileId,
					...(target === 'all'
						? { all_users: true }
						: { user_ids: selectedUsers.map((user) => user.id), all_users: false }),
					recipient_local_datetime: scheduleOn ? toLocalDateTime(recipientLocalDatetime) : null,
				},
			},
			{ onSuccess: onClose, onError: () => setConfirmDialogOpen(false) },
		);
	};

	const handleBroadcast = () => {
		if (sending) {
			return;
		}

		// 새로 고른 사진은 발송 직전에 업로드
		if (content.imageFile) {
			uploadNotificationImage.mutate(
				{ file: content.imageFile },
				{
					onSuccess: (imageFileId) => {
						// 발송에 실패해도 다시 업로드하지 않음
						setContent((prev) => ({ ...prev, imageFileId, imageFile: null }));
						broadcast(imageFileId);
					},
					onError: () => setConfirmDialogOpen(false),
				},
			);

			return;
		}

		broadcast(content.imageFileId);
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="grid md:min-h-140 md:grid-cols-[minmax(0,1fr)_400px]">
				{/*받는 사람, 내용, 예약 입력*/}
				<div className="@container grid content-start gap-3 px-4 pt-5 pb-6 md:px-6">
					<div className={rowClassName}>
						<span className={`${labelClassName} @md:pt-2`}>받는 사람</span>

						<div className="grid min-w-0 justify-items-start gap-2">
							<SegmentedControl
								label="받는 사람"
								options={RECIPIENT_TARGETS.map((recipientTarget) => ({
									value: recipientTarget.target,
									label: recipientTarget.label,
								}))}
								value={target}
								onValueChange={setTarget}
							/>

							{target === 'selected' && (
								<UserPicker
									selectedUsers={selectedUsers}
									onSelectedUsersChange={(users) =>
										setSelectedUsers(users.slice(0, BROADCAST_MAX_USER_COUNT))
									}
									isUserMuted={(user) => !receivesNotification(user, content.kind)}
									renderUserIcon={(user) => <NotificationReachIcon user={user} kind={content.kind} />}
								/>
							)}
						</div>
					</div>

					<NotificationContentFields content={content} onContentChange={setContent} />

					<div className={`${rowClassName} mt-2 items-center border-t pt-5`}>
						<span id={scheduleLabelId} className={labelClassName}>
							예약
						</span>

						<div className="flex min-h-9 flex-wrap items-center gap-2.5">
							<Switch
								aria-labelledby={scheduleLabelId}
								checked={scheduleOn}
								disabled={urgent}
								onCheckedChange={setScheduled}
							/>

							{scheduleOn && (
								<DateTimePicker
									value={recipientLocalDatetime}
									ariaLabel="예약 일시"
									required
									onValueChange={setRecipientLocalDatetime}
								/>
							)}

							{(urgent || scheduleOn) && (
								<span className="text-[12.5px] text-muted-foreground">
									{urgent ? '긴급 알림은 바로 발송' : '수신자 현지 시각'}
								</span>
							)}
						</div>
					</div>
				</div>

				{/*미리보기 및 받는 사람 수*/}
				<aside className="grid content-start gap-3 border-t bg-card-inset p-4 md:border-t-0 md:border-l md:p-5 [&_h4]:text-base [&_h4]:font-bold">
					<NotificationPreview
						kind={content.kind}
						title={toSentText(content.title, content.kind)}
						body={toSentText(content.body, content.kind)}
						imageUrl={content.imagePreviewUrl}
					/>

					<section className="mt-2 grid gap-3 border-t pt-4.5">
						<h3 className="text-base font-bold">받는 사람</h3>

						<FunnelRows
							color={NOTIFICATION_KINDS[content.kind].color}
							rows={[
								{ label: '대상', count: reachCounts[0] },
								{ label: '알림', count: reachCounts[1] },
								{ label: '푸시', count: reachCounts[2] },
							]}
						/>

						<p className="text-[12.5px] text-muted-foreground">{AUDIENCE_HELP_TEXTS[content.kind]}</p>
					</section>
				</aside>
			</div>

			<DialogFooter className="m-0 rounded-none border-t bg-card px-6 py-4">
				<Button type="button" variant="outline" disabled={sending} onClick={onClose}>
					취소
				</Button>
				<Button type="submit" loading={sending} disabled={recipientCount === 0}>
					{recipientCount.toLocaleString('ko-KR')}명에게 {scheduleOn ? '예약' : '발송'}
				</Button>
			</DialogFooter>

			<ConfirmDialog
				open={confirmDialogOpen}
				text={{
					title: `${recipientCount.toLocaleString('ko-KR')}명에게 ${scheduleOn ? '예약할까요?' : '보낼까요?'}`,
					confirm: scheduleOn ? '예약' : '발송',
				}}
				confirmVariant="default"
				busy={sending}
				onConfirm={handleBroadcast}
				onClose={() => setConfirmDialogOpen(false)}
			/>
		</form>
	);
};

export default SendNotificationForm;
