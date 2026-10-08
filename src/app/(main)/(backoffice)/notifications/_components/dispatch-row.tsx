'use client';

import type { CSSProperties } from 'react';

import type { NotificationDispatch } from '@/types/apis/notifications';

import { NOTIFICATION_KINDS } from '@/app/(main)/(backoffice)/_components/notification-kind-tag';
import ReadStatus from '@/app/(main)/(backoffice)/_components/read-status';
import DispatchDetail from '@/app/(main)/(backoffice)/notifications/_components/dispatch-detail';
import NotificationSummaryRow from '@/app/(main)/(backoffice)/notifications/_components/notification-summary-row';
import { formatLocalShortDateTime, formatRelativeTime, formatShortDateTime } from '@/utils/date';

interface Props {
	notificationDispatch: NotificationDispatch;
	keyword?: string;
	expanded: boolean;
	now: number;
	onToggle: () => void;
}

/**
 * 발송 한 번의 행 컴포넌트
 * @param notificationDispatch 표시할 발송
 * @param keyword 강조할 검색어
 * @param expanded 상세 표시 여부
 * @param now 현재 시각
 * @param onToggle 행을 누르면 실행할 함수
 */
const DispatchRow = ({ notificationDispatch, keyword, expanded, now, onToggle }: Props) => {
	const { recipient, recipient_local_datetime } = notificationDispatch;
	const firstSentAt = notificationDispatch.send_times[0]?.sent_at ?? notificationDispatch.created_at;
	const readPercent = notificationDispatch.recipient_count
		? Math.round((notificationDispatch.read_count / notificationDispatch.recipient_count) * 100)
		: 0;

	return (
		<NotificationSummaryRow
			id={notificationDispatch.id}
			kind={notificationDispatch.kind}
			title={notificationDispatch.title}
			body={notificationDispatch.body}
			imageUrl={notificationDispatch.image?.url}
			keyword={keyword}
			sentAt={
				<time dateTime={firstSentAt}>
					{recipient_local_datetime
						? formatLocalShortDateTime(recipient_local_datetime)
						: formatShortDateTime(firstSentAt)}
					<small className="block text-[12.5px]">
						{recipient_local_datetime ? '현지 시각' : formatRelativeTime(firstSentAt, now)}
					</small>
				</time>
			}
			result={
				recipient ? (
					<>
						<b className="max-w-full truncate font-bold">{recipient.nickname ?? '닉네임 없음'}</b>
						<ReadStatus readAt={recipient.read_at} />
					</>
				) : (
					<>
						<span className="whitespace-nowrap">
							<small className="mr-1.5 text-[12.5px] text-muted-foreground">
								{notificationDispatch.target === 'all' ? '전체' : '선택'}
							</small>
							<b className="font-bold">
								{notificationDispatch.recipient_count.toLocaleString('ko-KR')}명
							</b>
						</span>

						<span className="flex w-full items-center justify-end gap-1.5 text-[13px] whitespace-nowrap text-muted-foreground">
							<span
								className="mr-0.5 h-2 flex-1 rounded-full bg-muted transition-colors group-hover:bg-card"
								style={
									{
										'--kind-color': NOTIFICATION_KINDS[notificationDispatch.kind].color,
									} as CSSProperties
								}
							>
								<span
									className="block h-full rounded-full bg-(--kind-color)"
									style={{ width: `${readPercent}%` }}
								/>
							</span>
							읽음
							<b className="font-bold text-foreground">{readPercent}%</b>
						</span>
					</>
				)
			}
			expanded={expanded}
			onToggle={onToggle}
		>
			<DispatchDetail notificationDispatch={notificationDispatch} now={now} />
		</NotificationSummaryRow>
	);
};

export default DispatchRow;
