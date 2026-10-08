'use client';

import type { NotificationDispatch } from '@/types/apis/notifications';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';
import { ChevronDown, Clock } from 'lucide-react';

import NotificationKindTag, { NOTIFICATION_KINDS } from '@/app/(main)/(backoffice)/_components/notification-kind-tag';
import TimeAxis from '@/app/(main)/(backoffice)/_components/time-axis';
import TimeAxisTicks from '@/app/(main)/(backoffice)/_components/time-axis-ticks';
import DispatchDetail from '@/app/(main)/(backoffice)/notifications/_components/dispatch-detail';
import { rowButtonClassName } from '@/app/(main)/(backoffice)/notifications/_components/notification-summary-row';
import { formatDurationLater, formatLocalShortDateTime } from '@/utils/date';
import { koreanOrEnglishText } from '@/utils/i18n-text';
import type { TimeAxisRange } from '@/utils/time-axis';

import { Badge } from '@/components/ui/badge';

export const scheduledGridClassName =
	'grid grid-cols-[minmax(0,1fr)_16px] gap-x-4 md:grid-cols-[minmax(0,1fr)_46%_112px_16px]';

interface Props {
	notificationDispatch: NotificationDispatch;
	range: TimeAxisRange;
	expanded: boolean;
	now: number;
	onToggle: () => void;
}

/**
 * 발송 예정의 발송 하나의 행 컴포넌트
 * @param notificationDispatch 표시할 발송
 * @param range 시간 축의 범위
 * @param expanded 상세 표시 여부
 * @param now 현재 시각
 * @param onToggle 행을 누르면 실행할 함수
 */
const ScheduledDispatchRow = ({ notificationDispatch, range, expanded, now, onToggle }: Props) => {
	const detailId = `scheduled-dispatch-${notificationDispatch.id}`;
	const sending = notificationDispatch.status === 'sending';
	// 현재 시각 뒤의 가장 이른 발송 시각
	const nextSendTime = notificationDispatch.send_times.find((sendTime) => dayjs(sendTime.sent_at).valueOf() > now);

	return (
		<article className="border-t first:border-t-0">
			<div
				className={cn(
					scheduledGridClassName,
					'group relative -mx-2 items-center gap-y-3.5 rounded-md px-2 py-3.5 transition-colors hover:bg-muted',
				)}
			>
				<div className="grid min-w-0 gap-1">
					<p className="flex gap-1.5">
						<NotificationKindTag kind={notificationDispatch.kind} />
						<Badge
							className={cn(
								'rounded-sm font-bold',
								sending ? 'bg-success/10 text-success' : 'bg-info/10 text-info',
							)}
						>
							{sending ? '발송 중' : '예약'}
						</Badge>
					</p>

					<h3 className="font-semibold">
						<button
							type="button"
							aria-expanded={expanded}
							aria-controls={detailId}
							className={rowButtonClassName}
							onClick={onToggle}
						>
							{koreanOrEnglishText(notificationDispatch.title)}
						</button>
					</h3>

					{!!notificationDispatch.recipient_local_datetime && (
						<p className="text-[13px] text-muted-foreground tabular-nums">
							현지 {formatLocalShortDateTime(notificationDispatch.recipient_local_datetime)}
						</p>
					)}
				</div>

				<div className="min-w-0 max-md:col-span-full max-md:row-start-2">
					<TimeAxis
						bars={notificationDispatch.send_times}
						range={range}
						now={now}
						color={NOTIFICATION_KINDS[notificationDispatch.kind].color}
					/>
					<TimeAxisTicks range={range} now={now} className="mt-0.5 md:hidden" />
				</div>

				<div className="grid justify-items-end gap-1 text-right tabular-nums max-md:col-span-full max-md:grid-cols-[auto_minmax(0,1fr)] max-md:items-center max-md:justify-items-start max-md:gap-3">
					<b className="font-bold whitespace-nowrap">
						{sending && `${notificationDispatch.sent_count.toLocaleString('ko-KR')} / `}
						{notificationDispatch.recipient_count.toLocaleString('ko-KR')}명
					</b>

					{!!nextSendTime && (
						<span className="inline-flex items-center gap-1.5 text-[13px] whitespace-nowrap text-muted-foreground">
							<Clock aria-label="다음 발송" className="size-4 text-info">
								<title>다음 발송</title>
							</Clock>
							{formatDurationLater(dayjs(nextSendTime.sent_at).valueOf() - now)}
						</span>
					)}
				</div>

				<ChevronDown
					aria-hidden
					className={cn(
						'size-4 text-muted-foreground transition-transform max-md:col-start-2 max-md:row-start-1',
						expanded && 'rotate-180',
					)}
				/>
			</div>

			{expanded && (
				<div id={detailId} className="mb-4">
					<DispatchDetail notificationDispatch={notificationDispatch} now={now} />
				</div>
			)}
		</article>
	);
};

export default ScheduledDispatchRow;
