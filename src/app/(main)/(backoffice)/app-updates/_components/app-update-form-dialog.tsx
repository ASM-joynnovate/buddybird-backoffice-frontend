'use client';

import { useRef } from 'react';

import { useIsMutating } from '@tanstack/react-query';

import type { AppUpdate, Platform } from '@/types/apis/app-updates';

import { apiKeys } from '@/hooks/apis/keys';

import AppUpdateForm from '@/app/(main)/(backoffice)/app-updates/_components/app-update-form';

import ContentSkeleton from '@/components/content-skeleton';
import ErrorHandlingWrapper from '@/components/error-handling-wrapper';
import QueryError from '@/components/query-error';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props {
	platform: Platform;
	appUpdate?: AppUpdate;
	onClose: () => void;
}

/**
 * 업데이트 추가 및 편집 다이얼로그 컴포넌트
 * @param platform 화면에서 선택된 플랫폼
 * @param appUpdate 편집할 업데이트
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const AppUpdateFormDialog = ({ platform, appUpdate, onClose }: Props) => {
	const saving = useIsMutating({ mutationKey: apiKeys.mutation('app-updates') }) > 0;

	const versionInputRef = useRef<HTMLInputElement>(null);

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !saving) {
			onClose();
		}
	};

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<DialogContent initialFocus={appUpdate ? undefined : versionInputRef} className="gap-0 p-0 sm:max-w-245">
				<DialogHeader className="border-b px-6 py-4">
					<DialogTitle className="font-bold">{appUpdate ? '업데이트 편집' : '업데이트 추가'}</DialogTitle>
				</DialogHeader>

				<ErrorHandlingWrapper fallbackComponent={QueryError} suspenseFallback=<ContentSkeleton />>
					<AppUpdateForm
						platform={platform}
						appUpdate={appUpdate}
						versionInputRef={versionInputRef}
						onClose={onClose}
					/>
				</ErrorHandlingWrapper>
			</DialogContent>
		</Dialog>
	);
};

export default AppUpdateFormDialog;
