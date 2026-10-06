'use client';

import PushDeliveryList from '@/app/(main)/(backoffice)/users/[id]/_components/push-delivery-list';

import ContentSkeleton from '@/components/content-skeleton';
import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props {
	deviceId: string;
	onClose: () => void;
}

/**
 * 푸시 발송 기록 다이얼로그 컴포넌트
 * @param deviceId 조회할 기기 ID
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const PushDeliveryDialog = ({ deviceId, onClose }: Props) => {
	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>푸시 발송 기록</DialogTitle>
				</DialogHeader>

				<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<ContentSkeleton />>
					<PushDeliveryList deviceId={deviceId} />
				</ErrorHandlingWrapper>
			</DialogContent>
		</Dialog>
	);
};

export default PushDeliveryDialog;
