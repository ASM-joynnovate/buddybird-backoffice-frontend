'use client';

import type { NotificationListParams } from '@/types/apis/notifications';

import { useGetNotificationList } from '@/hooks/apis/notifications';

import type { SearchParamValue } from '@/lib/api';

import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import NotificationEmptyState from '@/app/(main)/(backoffice)/notifications/_components/notification-empty-state';
import NotificationRow from '@/app/(main)/(backoffice)/notifications/_components/notification-row';

import PageNavigation from '@/components/page-navigation';

interface Props {
	title: string;
	listParams: NotificationListParams;
	filterSelected: boolean;
	query: Record<string, SearchParamValue>;
	expandedRowId: string | null;
	now: number;
	onToggleRow: (rowId: string) => void;
}

/**
 * 받는 사람마다 한 건인 알림 목록 컴포넌트
 * @param title 카드 제목
 * @param listParams 목록 조회 조건
 * @param filterSelected 받는 사람, 종류, 날짜 조건을 골랐는지 여부
 * @param query 현재 주소의 쿼리
 * @param expandedRowId 펼친 행의 id
 * @param now 현재 시각
 * @param onToggleRow 행을 누르면 실행할 함수
 */
const NotificationList = ({ title, listParams, filterSelected, query, expandedRowId, now, onToggleRow }: Props) => {
	const { data: notificationListData } = useGetNotificationList(listParams);

	if (notificationListData.data.length === 0) {
		return <NotificationEmptyState title={title} keyword={listParams.keyword} filterSelected={filterSelected} />;
	}

	return (
		<>
			<TitledCard title={title}>
				{notificationListData.data.map((notification) => (
					<NotificationRow
						key={notification.id}
						notification={notification}
						keyword={listParams.keyword}
						recipientListed={!!listParams.user_id}
						expanded={expandedRowId === notification.id}
						now={now}
						onToggle={() => onToggleRow(notification.id)}
					/>
				))}
			</TitledCard>

			<PageNavigation meta={notificationListData.meta} pathname="/notifications" query={query} />
		</>
	);
};

export default NotificationList;
