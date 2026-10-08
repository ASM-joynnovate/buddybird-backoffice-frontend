'use client';

import type { NotificationDispatchListParams } from '@/types/apis/notifications';

import { useGetNotificationDispatchList } from '@/hooks/apis/notifications';

import type { SearchParamValue } from '@/lib/api';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import DispatchRow from '@/app/(main)/(backoffice)/notifications/_components/dispatch-row';
import NotificationEmptyState from '@/app/(main)/(backoffice)/notifications/_components/notification-empty-state';

import PageNavigation from '@/components/page-navigation';

interface Props {
	listParams: NotificationDispatchListParams;
	filterSelected: boolean;
	query: Record<string, SearchParamValue>;
	expandedRowId: string | null;
	now: number;
	onToggleRow: (rowId: string) => void;
}

/**
 * 보낸 알림의 발송 목록 컴포넌트
 * @param listParams 목록 조회 조건
 * @param filterSelected 종류, 날짜 조건을 골랐는지 여부
 * @param query 현재 주소의 쿼리
 * @param expandedRowId 펼친 행의 id
 * @param now 현재 시각
 * @param onToggleRow 행을 누르면 실행할 함수
 */
const DispatchList = ({ listParams, filterSelected, query, expandedRowId, now, onToggleRow }: Props) => {
	const { data: dispatchListData } = useGetNotificationDispatchList(listParams);

	if (dispatchListData.data.length === 0) {
		return (
			<NotificationEmptyState title="보낸 알림" keyword={listParams.keyword} filterSelected={filterSelected} />
		);
	}

	return (
		<>
			<TitledCard title="보낸 알림">
				{dispatchListData.data.map((notificationDispatch) => (
					<DispatchRow
						key={notificationDispatch.id}
						notificationDispatch={notificationDispatch}
						keyword={listParams.keyword}
						expanded={expandedRowId === notificationDispatch.id}
						now={now}
						onToggle={() => onToggleRow(notificationDispatch.id)}
					/>
				))}
			</TitledCard>

			<PageNavigation meta={dispatchListData.meta} pathname="/notifications" query={query} />
		</>
	);
};

export default DispatchList;
