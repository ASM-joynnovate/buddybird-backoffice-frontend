'use client';

import Link from 'next/link';

import type { NotificationListParams } from '@/types/apis/notifications';

import { useGetNotificationList } from '@/hooks/apis/notifications';

import { formatDateTime } from '@/utils/date';
import { koreanOrEnglishText } from '@/utils/i18n-text';

import PageNavigation from '@/components/page-navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
	listParams: NotificationListParams;
}

/**
 * 알림 발송 이력 목록 컴포넌트
 * @param listParams 조회 조건
 */
const NotificationList = ({ listParams }: Props) => {
	const { data: notificationListData } = useGetNotificationList(listParams);

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>발송 일시</TableHead>
						<TableHead>사용자</TableHead>
						<TableHead>종류</TableHead>
						<TableHead>제목</TableHead>
						<TableHead>본문</TableHead>
						<TableHead>사진</TableHead>
						<TableHead>읽은 일시</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{notificationListData.data.map((notification) => (
						<TableRow key={notification.id}>
							<TableCell>{formatDateTime(notification.sent_at)}</TableCell>
							<TableCell>
								<Link href={`/users/${notification.user_id}`}>{notification.user_id}</Link>
							</TableCell>
							<TableCell>{notification.kind}</TableCell>
							<TableCell>{koreanOrEnglishText(notification.title)}</TableCell>
							<TableCell>{koreanOrEnglishText(notification.body)}</TableCell>
							<TableCell>
								{notification.image ? (
									<Link href={notification.image.url} target="_blank">
										보기
									</Link>
								) : (
									'-'
								)}
							</TableCell>
							<TableCell>{notification.read_at ? formatDateTime(notification.read_at) : '-'}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{notificationListData.data.length === 0 && (
				<p className="text-sm text-muted-foreground">알림이 없습니다.</p>
			)}

			<PageNavigation
				meta={notificationListData.meta}
				pathname="/notifications"
				query={{ user_id: listParams.user_id, kind: listParams.kind }}
			/>
		</>
	);
};

export default NotificationList;
