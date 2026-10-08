'use client';

import { useState } from 'react';

import { useGetPushDeliveryList } from '@/hooks/apis/notifications';

import NotificationKindTag from '@/app/(main)/(backoffice)/_components/notification-kind-tag';
import { formatDateTime } from '@/utils/date';
import { koreanOrEnglishText } from '@/utils/i18n-text';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Props {
	deviceId: string;
}

/**
 * 푸시 발송 기록 목록 컴포넌트
 * @param deviceId 조회할 기기 ID
 */
const PushDeliveryList = ({ deviceId }: Props) => {
	const [page, setPage] = useState(1);

	const { data: pushDeliveryListData } = useGetPushDeliveryList({ device_id: deviceId, page });

	return (
		<>
			{pushDeliveryListData.data.length === 0 ? (
				<p className="text-muted-foreground">푸시 발송 기록이 없습니다.</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="pl-0 text-muted-foreground">발송 일시</TableHead>
							<TableHead className="text-muted-foreground">종류</TableHead>
							<TableHead className="text-muted-foreground">제목</TableHead>
							<TableHead className="text-muted-foreground">본문</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{pushDeliveryListData.data.map((pushDelivery) => (
							<TableRow key={pushDelivery.id}>
								<TableCell className="py-2.5 pl-0 text-muted-foreground tabular-nums">
									{formatDateTime(pushDelivery.sent_at)}
								</TableCell>
								<TableCell className="py-2.5">
									<NotificationKindTag kind={pushDelivery.kind} />
								</TableCell>
								<TableCell className="min-w-40 py-2.5 whitespace-normal">
									{koreanOrEnglishText(pushDelivery.title)}
								</TableCell>
								<TableCell className="min-w-40 py-2.5 whitespace-normal">
									{pushDelivery.body ? koreanOrEnglishText(pushDelivery.body) : '-'}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			<div className="flex justify-end gap-1.5">
				<Button
					variant="outline"
					size="sm"
					disabled={pushDeliveryListData.meta.is_first}
					onClick={() => setPage((prev) => prev - 1)}
				>
					이전
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={pushDeliveryListData.meta.is_last}
					onClick={() => setPage((prev) => prev + 1)}
				>
					다음
				</Button>
			</div>
		</>
	);
};

export default PushDeliveryList;
