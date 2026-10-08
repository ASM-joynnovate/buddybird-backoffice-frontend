'use client';

import type { NotificationDispatch } from '@/types/apis/notifications';

import dayjs from 'dayjs';

import FunnelRows from '@/app/(main)/(backoffice)/_components/funnel-rows';
import { NOTIFICATION_KINDS } from '@/app/(main)/(backoffice)/_components/notification-kind-tag';
import NotificationPreview from '@/app/(main)/(backoffice)/_components/notification-preview';
import TimeAxis from '@/app/(main)/(backoffice)/_components/time-axis';
import TimeAxisTicks from '@/app/(main)/(backoffice)/_components/time-axis-ticks';
import DetailActions from '@/app/(main)/(backoffice)/notifications/_components/detail-actions';
import ReadTrend from '@/app/(main)/(backoffice)/notifications/_components/read-trend';
import RecipientDetail, {
	detailPanelClassName,
	detailSectionClassName,
	detailStatClassName,
} from '@/app/(main)/(backoffice)/notifications/_components/recipient-detail';
import { toCopiedContent } from '@/utils/notification';
import { toTimeAxisRange } from '@/utils/time-axis';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
	notificationDispatch: NotificationDispatch;
	now: number;
}

/**
 * 펼친 발송의 상세 컴포넌트
 * @param notificationDispatch 표시할 발송
 * @param now 현재 시각
 */
const DispatchDetail = ({ notificationDispatch, now }: Props) => {
	const { kind, recipient, status } = notificationDispatch;
	const color = NOTIFICATION_KINDS[kind].color;
	const delivered = notificationDispatch.sent_count > 0;
	const sendTimeRange = toTimeAxisRange(
		notificationDispatch.send_times.map((sendTime) => dayjs(sendTime.sent_at).valueOf()),
	);

	const detailActions = (
		<DetailActions
			copiedContent={toCopiedContent(notificationDispatch)}
			copiedUserId={recipient?.user_id}
			notificationDispatch={notificationDispatch}
		/>
	);

	if (recipient) {
		return (
			<RecipientDetail
				kind={kind}
				title={notificationDispatch.title}
				body={notificationDispatch.body}
				imageUrl={notificationDispatch.image?.url}
				recipient={recipient}
				sentAt={status === 'sent' ? (notificationDispatch.send_times[0]?.sent_at ?? null) : null}
				pushSentAt={recipient.push_sent_at}
				readAt={recipient.read_at}
			>
				{detailActions}
			</RecipientDetail>
		);
	}

	return (
		<div className={detailPanelClassName}>
			<div className={detailSectionClassName}>
				<NotificationPreview
					kind={kind}
					title={notificationDispatch.title}
					body={notificationDispatch.body}
					imageUrl={notificationDispatch.image?.url}
				/>
			</div>

			<section className={detailStatClassName}>
				<h4 className="text-[13px] font-semibold">{delivered ? '전달' : '예상 전달'}</h4>

				<FunnelRows
					color={color}
					rows={
						delivered
							? [
									{ label: '받은 사람', count: notificationDispatch.sent_count },
									{ label: '푸시', count: notificationDispatch.push_sent_count },
									{ label: '읽음', count: notificationDispatch.read_count },
								]
							: [
									{ label: '받는 사람', count: notificationDispatch.recipient_count },
									{ label: '푸시 가능', count: notificationDispatch.push_waiting_count },
								]
					}
				/>

				<p className="text-[12.5px] text-muted-foreground">
					푸시는 알림을 켠 기기에만 발송
					{kind === 'marketing' && ', 21시부터 8시까지는 야간 수신에 동의한 기기에만 발송'}
				</p>
			</section>

			{status === 'sent' && (
				<section className={`${detailSectionClassName} col-span-full border-t`}>
					<ErrorHandlingWrapper
						fallbackComponent={QueryError}
						suspenseFallback=<>
							<h4 className="min-h-7 text-[13px] leading-7 font-semibold">읽음 추이</h4>
							<Skeleton className="h-30" />
						</>
					>
						<ReadTrend notificationDispatch={notificationDispatch} now={now} />
					</ErrorHandlingWrapper>
				</section>
			)}

			{!!notificationDispatch.recipient_local_datetime && status === 'sent' && (
				<section className={`${detailSectionClassName} col-span-full border-t`}>
					<div className="flex min-h-7 items-center justify-between gap-3">
						<h4 className="text-[13px] font-semibold">발송 시각</h4>
						<p className="text-[13px] text-muted-foreground">한국 시간 기준</p>
					</div>

					<div>
						<TimeAxis
							bars={notificationDispatch.send_times}
							range={sendTimeRange}
							now={now}
							color={color}
						/>
						<TimeAxisTicks
							range={sendTimeRange}
							now={now}
							className="mt-0.5 max-md:[&>span:nth-of-type(even)]:hidden"
						/>
					</div>
				</section>
			)}

			{detailActions}
		</div>
	);
};

export default DispatchDetail;
