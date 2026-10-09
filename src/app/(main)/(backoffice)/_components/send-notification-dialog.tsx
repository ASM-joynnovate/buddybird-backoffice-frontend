'use client';

import { useIsMutating } from '@tanstack/react-query';

import { apiKeys } from '@/hooks/apis/keys';

import { cn } from '@/lib/utils';

import {
	initialNotificationContent,
	type NotificationContent,
} from '@/app/(main)/(backoffice)/_components/notification-content-fields';
import SendNotificationForm from '@/app/(main)/(backoffice)/_components/send-notification-form';

import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import FormDialogSkeleton from '@/components/form-dialog-skeleton';
import QueryError from '@/components/query-error';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props {
	initialContent?: NotificationContent;
	initialUserId?: string;
	onClose: () => void;
}

/**
 * 알림 보내기 다이얼로그 컴포넌트
 * @param initialContent 처음에 채워 둘 알림 내용
 * @param initialUserId 처음에 고를 사용자 ID
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const SendNotificationDialog = ({ initialContent = initialNotificationContent, initialUserId, onClose }: Props) => {
	// 사진 업로드 및 발송 요청
	const sending = useIsMutating({ mutationKey: apiKeys.mutation('notifications') }) > 0;

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !sending) {
			onClose();
		}
	};

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<DialogContent className="gap-0 p-0 sm:max-w-280">
				<DialogHeader className="border-b px-6 py-4">
					<DialogTitle className="font-bold">알림 보내기</DialogTitle>
				</DialogHeader>

				<DialogBody>
					{/*미리 보기 칸은 400px, 받는 사람을 고른 채 열면 폼이 그 줄만큼 높음*/}
					<ErrorHandlingWrapper
						fallbackComponent={QueryError}
						suspenseFallback=<FormDialogSkeleton
							className={cn('md:grid-cols-[minmax(0,1fr)_400px]', initialUserId && 'lg:min-h-144')}
						/>
					>
						<SendNotificationForm
							initialContent={initialContent}
							initialUserIds={initialUserId ? [initialUserId] : []}
							onClose={onClose}
						/>
					</ErrorHandlingWrapper>
				</DialogBody>
			</DialogContent>
		</Dialog>
	);
};

export default SendNotificationDialog;
