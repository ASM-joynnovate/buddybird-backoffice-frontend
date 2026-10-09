'use client';

import { useEffect, useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import type { NotificationDispatchListParams } from '@/types/apis/notifications';

import { apiKeys } from '@/hooks/apis/keys';
import { useGetNotificationDispatchList } from '@/hooks/apis/notifications';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';

import TimeAxisTicks from '@/app/(main)/(backoffice)/_components/time-axis-ticks';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import ScheduledDispatchRow, {
	scheduledGridClassName,
} from '@/app/(main)/(backoffice)/notifications/_components/scheduled-dispatch-row';
import { toTimeAxisRange } from '@/utils/time-axis';

interface Props {
	listParams: NotificationDispatchListParams;
	expandedRowId: string | null;
	now: number;
	onToggleRow: (rowId: string) => void;
}

/**
 * 발송되지 않은 알림이 남은 발송의 카드 컴포넌트
 * @param listParams 목록 조회 조건
 * @param expandedRowId 펼친 행의 id
 * @param now 현재 시각
 * @param onToggleRow 행을 누르면 실행할 함수
 */
const ScheduledDispatchCard = ({ listParams, expandedRowId, now, onToggleRow }: Props) => {
	const queryClient = useQueryClient();

	const { data: dispatchListData } = useGetNotificationDispatchList(listParams);

	// 발송이 진행되면 바뀌는 값
	const sendProgress = dispatchListData.data
		.map((notificationDispatch) => `${notificationDispatch.id}:${notificationDispatch.sent_count}`)
		.join(',');
	const sendProgressRef = useRef(sendProgress);

	/** 발송이 진행되면 보낸 알림 및 대시보드 다시 조회 */
	useEffect(() => {
		if (sendProgressRef.current === sendProgress) {
			return;
		}

		sendProgressRef.current = sendProgress;

		void queryClient.invalidateQueries({ queryKey: apiKeys.notifications.all() });
		void queryClient.invalidateQueries({ queryKey: apiKeys.dashboard.all() });
	}, [queryClient, sendProgress]);

	if (dispatchListData.data.length === 0) {
		return null;
	}

	// 가장 이른 발송 시각이 빠른 것부터 나열
	const notificationDispatches = dispatchListData.data.toReversed();
	// 모든 행이 같은 범위를 사용
	const range = toTimeAxisRange([
		now,
		...notificationDispatches.flatMap((notificationDispatch) =>
			notificationDispatch.send_times.map((sendTime) => dayjs(sendTime.sent_at).valueOf()),
		),
	]);

	return (
		<TitledCard title="발송 예정" action=<span className="text-[13px] text-muted-foreground">한국 시간 기준</span>>
			<div
				className={cn(
					scheduledGridClassName,
					'-mx-2 items-end border-b px-2 pb-1.5 text-[13px] font-medium text-muted-foreground max-md:hidden',
				)}
			>
				<span>알림</span>
				<TimeAxisTicks range={range} now={now} />
				<span className="text-right">받는 사람</span>
			</div>

			{notificationDispatches.map((notificationDispatch) => (
				<ScheduledDispatchRow
					key={notificationDispatch.id}
					notificationDispatch={notificationDispatch}
					range={range}
					expanded={expandedRowId === `scheduled-${notificationDispatch.id}`}
					now={now}
					onToggle={() => onToggleRow(`scheduled-${notificationDispatch.id}`)}
				/>
			))}
		</TitledCard>
	);
};

export default ScheduledDispatchCard;
