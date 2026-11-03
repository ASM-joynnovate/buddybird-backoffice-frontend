'use client';

import { type Notification, sendableNotificationKindSchema } from '@/types/apis/notifications';

import ReadStatus from '@/app/(main)/(backoffice)/_components/read-status';
import DetailActions from '@/app/(main)/(backoffice)/notifications/_components/detail-actions';
import NotificationSummaryRow from '@/app/(main)/(backoffice)/notifications/_components/notification-summary-row';
import RecipientDetail from '@/app/(main)/(backoffice)/notifications/_components/recipient-detail';
import { formatRelativeTime, formatShortDateTime } from '@/utils/date';
import { toCopiedContent } from '@/utils/notification';

interface Props {
	notification: Notification;
	keyword?: string;
	recipientListed: boolean;
	expanded: boolean;
	now: number;
	onToggle: () => void;
}

/**
 * 수신자 한 명의 알림 행 컴포넌트
 * @param notification 표시할 알림
 * @param keyword 강조할 검색어
 * @param recipientListed 한 사용자가 수신한 알림 목록인지 여부
 * @param expanded 상세 표시 여부
 * @param now 현재 시각
 * @param onToggle 행을 누르면 실행할 함수
 */
const NotificationRow = ({ notification, keyword, recipientListed, expanded, now, onToggle }: Props) => {
	const { kind } = notification;
	const sendableKind = sendableNotificationKindSchema.safeParse(kind).data;

	return (
		<NotificationSummaryRow
			id={notification.id}
			kind={kind}
			title={notification.title}
			body={notification.body}
			imageUrl={notification.image?.url}
			keyword={keyword}
			sentAt={
				<time dateTime={notification.sent_at}>
					{formatShortDateTime(notification.sent_at)}
					<small className="block text-[12.5px]">{formatRelativeTime(notification.sent_at, now)}</small>
				</time>
			}
			result={
				<>
					{!recipientListed && (
						<b className="max-w-full truncate font-bold">{notification.user.nickname ?? '닉네임 없음'}</b>
					)}
					<ReadStatus readAt={notification.read_at} />
				</>
			}
			expanded={expanded}
			onToggle={onToggle}
		>
			<RecipientDetail
				kind={kind}
				title={notification.title}
				body={notification.body}
				imageUrl={notification.image?.url}
				recipient={recipientListed ? undefined : { user_id: notification.user_id, ...notification.user }}
				sentAt={notification.sent_at}
				pushSentAt={notification.push_sent_at}
				readAt={notification.read_at}
			>
				{/*직접 발송하는 종류만 다시 발송*/}
				{!!sendableKind && (
					<DetailActions
						copiedContent={toCopiedContent({ ...notification, kind: sendableKind })}
						copiedUserId={notification.user_id}
					/>
				)}
			</RecipientDetail>
		</NotificationSummaryRow>
	);
};

export default NotificationRow;
