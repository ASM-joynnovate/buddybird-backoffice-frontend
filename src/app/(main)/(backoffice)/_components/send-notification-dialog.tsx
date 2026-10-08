'use client';

import { useIsMutating } from '@tanstack/react-query';

import { apiKeys } from '@/hooks/apis/keys';

import {
	initialNotificationContent,
	type NotificationContent,
} from '@/app/(main)/(backoffice)/_components/notification-content-fields';
import SendNotificationForm from '@/app/(main)/(backoffice)/_components/send-notification-form';

import ContentSkeleton from '@/components/content-skeleton';
import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
	const broadcasting = useIsMutating({ mutationKey: apiKeys.mutation('notifications', 'broadcast') }) > 0;

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !broadcasting) {
			onClose();
		}
	};

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<DialogContent className="gap-0 p-0 sm:max-w-280">
				<DialogHeader className="border-b px-6 py-4">
					<DialogTitle className="font-bold">알림 보내기</DialogTitle>
				</DialogHeader>

				<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<ContentSkeleton />>
					<SendNotificationForm
						initialContent={initialContent}
						initialUserIds={initialUserId ? [initialUserId] : []}
						onClose={onClose}
					/>
				</ErrorHandlingWrapper>
			</DialogContent>
		</Dialog>
	);
};

export default SendNotificationDialog;
