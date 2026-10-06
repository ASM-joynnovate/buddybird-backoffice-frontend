'use client';

import { useState } from 'react';

import { useGetPushDeliveryList } from '@/hooks/apis/notifications';

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
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>발송 일시</TableHead>
						<TableHead>예약 일시</TableHead>
						<TableHead>종류</TableHead>
						<TableHead>제목</TableHead>
						<TableHead>본문</TableHead>
					</TableRow>
				</TableHeader>

				<TableBody>
					{pushDeliveryListData.data.map((pushDelivery) => (
						<TableRow key={pushDelivery.id}>
							<TableCell>{formatDateTime(pushDelivery.sent_at)}</TableCell>
							<TableCell>{formatDateTime(pushDelivery.scheduled_at)}</TableCell>
							<TableCell>{pushDelivery.kind}</TableCell>
							<TableCell>{koreanOrEnglishText(pushDelivery.title)}</TableCell>
							<TableCell>{pushDelivery.body ? koreanOrEnglishText(pushDelivery.body) : '-'}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{pushDeliveryListData.data.length === 0 && (
				<p className="text-sm text-muted-foreground">푸시 발송 기록이 없습니다.</p>
			)}

			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					disabled={pushDeliveryListData.meta.is_first}
					onClick={() => setPage((prev) => prev - 1)}
				>
					이전
				</Button>
				<Button
					variant="outline"
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
