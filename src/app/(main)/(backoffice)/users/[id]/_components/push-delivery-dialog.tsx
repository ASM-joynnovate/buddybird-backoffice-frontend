'use client';

import type { Device } from '@/types/apis/devices';

import PushDeliveryList from '@/app/(main)/(backoffice)/users/[id]/_components/push-delivery-list';

import ContentSkeleton from '@/components/content-skeleton';
import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props {
	device: Device;
	onClose: () => void;
}

/**
 * 푸시 발송 기록 다이얼로그 컴포넌트
 * @param device 조회할 기기
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const PushDeliveryDialog = ({ device, onClose }: Props) => {
	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent className="rounded-xl px-5 py-4.5 sm:max-w-190">
				<DialogHeader className="flex-row items-baseline gap-3">
					<DialogTitle className="font-bold">푸시 발송 기록</DialogTitle>
					<DialogDescription className="text-[13px]">{device.client.model}</DialogDescription>
				</DialogHeader>

				<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<ContentSkeleton />>
					<PushDeliveryList deviceId={device.id} />
				</ErrorHandlingWrapper>
			</DialogContent>
		</Dialog>
	);
};

export default PushDeliveryDialog;
