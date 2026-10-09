'use client';

import type { Device } from '@/types/apis/devices';

import PushDeliveryList from '@/app/(main)/(backoffice)/users/[id]/_components/push-delivery-list';
import PushDeliveryListSkeleton from '@/app/(main)/(backoffice)/users/[id]/_components/push-delivery-list-skeleton';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

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

				<DialogBody className="-mx-5 px-5">
					<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<PushDeliveryListSkeleton />>
						<PushDeliveryList deviceId={device.id} />
					</ErrorHandlingWrapper>
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
};

export default PushDeliveryDialog;
