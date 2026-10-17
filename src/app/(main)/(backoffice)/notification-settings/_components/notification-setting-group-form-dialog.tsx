'use client';

import { type SubmitEvent, useState } from 'react';

import type { NotificationSettingGroup } from '@/types/apis/notification-settings';

import type { I18nFieldValue } from '@/types/i18n';

import {
	useCreateNotificationSettingGroup,
	useUpdateNotificationSettingGroup,
} from '@/hooks/apis/notification-settings';

import NotificationSettingTextField from '@/app/(main)/(backoffice)/notification-settings/_components/notification-setting-text-field';
import { toI18nFieldValue, toI18nText, toOptionalI18nText } from '@/utils/i18n-text';
import { toNotificationSettingTextError, toNotificationSettingTextUpdate } from '@/utils/notification-setting';

import ConfirmDialog from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props {
	group?: NotificationSettingGroup;
	onClose: () => void;
}

/**
 * 알림 설정 그룹 추가 및 수정 다이얼로그 컴포넌트
 * @param group 수정할 그룹
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const NotificationSettingGroupFormDialog = ({ group, onClose }: Props) => {
	const [locale, setLocale] = useState<keyof I18nFieldValue>('ko_kr');
	const [title, setTitle] = useState(toI18nFieldValue(group?.title ?? null));
	const [description, setDescription] = useState(toI18nFieldValue(group?.description ?? null));
	const [textError, setTextError] = useState('');
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

	const createGroup = useCreateNotificationSettingGroup();
	const updateGroup = useUpdateNotificationSettingGroup();

	const saving = createGroup.isPending || updateGroup.isPending;

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !saving) {
			onClose();
		}
	};

	const handleTitleChange = (localeTitle: string) => {
		setTitle((prev) => ({ ...prev, [locale]: localeTitle }));
		setTextError('');
	};

	const handleDescriptionChange = (localeDescription: string) => {
		setDescription((prev) => ({ ...prev, [locale]: localeDescription }));
		setTextError('');
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (saving) {
			return;
		}

		const nextTextError = toNotificationSettingTextError(title, description);

		setTextError(nextTextError);

		// 빠진 영어 문구를 입력하도록 영어 선택
		if (nextTextError) {
			setLocale('en_us');

			return;
		}

		// 바뀐 값이 없는 수정은 요청 없이 닫음
		if (group && Object.keys(toNotificationSettingTextUpdate(title, description, group)).length === 0) {
			onClose();

			return;
		}

		setConfirmDialogOpen(true);
	};

	const handleSave = () => {
		if (saving) {
			return;
		}

		if (group) {
			// 수정은 바뀐 값만 보냄
			updateGroup.mutate(
				{ id: group.id, data: toNotificationSettingTextUpdate(title, description, group) },
				{ onSuccess: onClose, onError: () => setConfirmDialogOpen(false) },
			);

			return;
		}

		createGroup.mutate(
			{ data: { title: toI18nText(title), description: toOptionalI18nText(description) } },
			{ onSuccess: onClose, onError: () => setConfirmDialogOpen(false) },
		);
	};

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<DialogContent className="gap-0 p-0 sm:max-w-190">
				<form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
					<DialogHeader className="border-b px-6 py-4">
						<DialogTitle className="font-bold">{group ? '그룹 수정' : '그룹 추가'}</DialogTitle>
					</DialogHeader>

					<DialogBody className="@container px-4 pt-5 pb-6 md:px-6">
						<div className="grid gap-1.5 @md:grid-cols-[72px_minmax(0,1fr)] @md:gap-3">
							<span className="text-[13px] font-semibold text-muted-foreground @md:pt-2">내용</span>

							<NotificationSettingTextField
								locale={locale}
								title={title}
								description={description}
								error={textError}
								onLocaleChange={setLocale}
								onTitleChange={handleTitleChange}
								onDescriptionChange={handleDescriptionChange}
							/>
						</div>
					</DialogBody>

					<DialogFooter className="m-0 rounded-none border-t bg-card px-6 py-4">
						<Button type="button" variant="outline" disabled={saving} onClick={onClose}>
							취소
						</Button>
						<Button type="submit" loading={saving}>
							{group ? '저장' : '추가'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>

			<ConfirmDialog
				open={confirmDialogOpen}
				text={
					group
						? { title: '그룹을 수정할까요?', confirm: '저장' }
						: { title: '그룹을 추가할까요?', confirm: '추가' }
				}
				confirmVariant="default"
				busy={saving}
				onConfirm={handleSave}
				onClose={() => setConfirmDialogOpen(false)}
			/>
		</Dialog>
	);
};

export default NotificationSettingGroupFormDialog;
