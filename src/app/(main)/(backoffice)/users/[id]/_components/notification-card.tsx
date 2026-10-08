'use client';

import { useGetNotificationList } from '@/hooks/apis/notifications';

import NotificationKindTag from '@/app/(main)/(backoffice)/_components/notification-kind-tag';
import TitledCard from '@/app/(main)/(backoffice)/_components/titled-card';
import { USER_RECENT_ITEM_COUNT } from '@/config';
import { formatDateTime } from '@/utils/date';
import { koreanOrEnglishText } from '@/utils/i18n-text';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
	id: string;
}

/**
 * 사용자의 최근 알림 카드 컴포넌트
 * @param id 조회할 사용자 ID
 */
const NotificationCard = ({ id }: Props) => {
	const { data: notificationListData } = useGetNotificationList({
		page: 1,
		count_by_page: USER_RECENT_ITEM_COUNT,
		user_id: id,
	});

	if (notificationListData.data.length === 0) {
		return (
			<TitledCard title="알림">
				<p className="text-muted-foreground">알림이 없습니다.</p>
			</TitledCard>
		);
	}

	return (
		<TitledCard title="알림" href={`/notifications?user_id=${id}`} linkLabel="알림 탭에서 전체 보기">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="pl-0 text-muted-foreground">발송 일시</TableHead>
						<TableHead className="text-muted-foreground">종류</TableHead>
						<TableHead className="text-muted-foreground">제목</TableHead>
						<TableHead className="text-muted-foreground">읽음</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{notificationListData.data.map((notification) => (
						<TableRow key={notification.id}>
							<TableCell className="py-2.5 pl-0 text-muted-foreground tabular-nums">
								{formatDateTime(notification.sent_at)}
							</TableCell>
							<TableCell className="py-2.5">
								<NotificationKindTag kind={notification.kind} />
							</TableCell>
							<TableCell className="min-w-50 py-2.5 whitespace-normal">
								{koreanOrEnglishText(notification.title)}
							</TableCell>
							<TableCell className="py-2.5 text-muted-foreground tabular-nums">
								{notification.read_at ? formatDateTime(notification.read_at) : '읽지 않음'}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TitledCard>
	);
};

export default NotificationCard;
