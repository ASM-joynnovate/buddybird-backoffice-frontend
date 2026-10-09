'use client';

import { type ReactNode, useState } from 'react';

import type { NotificationDispatchListParams, NotificationListParams } from '@/types/apis/notifications';

import { useNow } from '@/hooks/use-now';

import type { SearchParamValue } from '@/lib/api';

import DispatchList from '@/app/(main)/(backoffice)/notifications/_components/dispatch-list';
import NotificationList from '@/app/(main)/(backoffice)/notifications/_components/notification-list';
import NotificationListSkeleton from '@/app/(main)/(backoffice)/notifications/_components/notification-list-skeleton';
import ScheduledDispatchCard from '@/app/(main)/(backoffice)/notifications/_components/scheduled-dispatch-card';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';

interface Props {
	scheduledListParams?: NotificationDispatchListParams;
	dispatchListParams?: NotificationDispatchListParams;
	notificationListParams: NotificationListParams;
	filterSelected: boolean;
	query: Record<string, SearchParamValue>;
	initialNow: number;
	searchBar: ReactNode;
}

/**
 * "발송 예정" 및 보낸 알림 목록 컴포넌트
 * @param scheduledListParams "발송 예정" 조회 조건
 * @param dispatchListParams 발송 목록 조회 조건
 * @param notificationListParams 알림 목록 조회 조건
 * @param filterSelected 받는 사람, 종류, 날짜 조건을 골랐는지 여부
 * @param query 현재 주소의 쿼리
 * @param initialNow 서버가 화면을 그린 시각
 * @param searchBar 목록 위에 둘 검색 및 필터
 */
const NotificationFeed = ({
	scheduledListParams,
	dispatchListParams,
	notificationListParams,
	filterSelected,
	query,
	initialNow,
	searchBar,
}: Props) => {
	const now = useNow(initialNow);

	const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

	const listTitle = notificationListParams.user_id ? '받은 알림' : '보낸 알림';

	/** 한 번에 한 행만 펼침 */
	const handleToggleRow = (rowId: string) => {
		setExpandedRowId((prev) => (prev === rowId ? null : rowId));
	};

	return (
		<div className="min-w-0 space-y-4">
			{!!scheduledListParams && (
				<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback={null}>
					<ScheduledDispatchCard
						listParams={scheduledListParams}
						expandedRowId={expandedRowId}
						now={now}
						onToggleRow={handleToggleRow}
					/>
				</ErrorHandlingWrapper>
			)}

			{searchBar}

			<ErrorHandlingWrapper
				fallbackComponent={QueryError}
				suspenseFallback=<NotificationListSkeleton title={listTitle} />
			>
				{dispatchListParams ? (
					<DispatchList
						listParams={dispatchListParams}
						filterSelected={filterSelected}
						query={query}
						expandedRowId={expandedRowId}
						now={now}
						onToggleRow={handleToggleRow}
					/>
				) : (
					<NotificationList
						title={listTitle}
						listParams={notificationListParams}
						filterSelected={filterSelected}
						query={query}
						expandedRowId={expandedRowId}
						now={now}
						onToggleRow={handleToggleRow}
					/>
				)}
			</ErrorHandlingWrapper>
		</div>
	);
};

export default NotificationFeed;
