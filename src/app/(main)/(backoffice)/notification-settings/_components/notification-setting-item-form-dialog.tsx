'use client';

import { type SubmitEvent, useId, useState } from 'react';

import { ApiError } from '@/types/apis/common';
import {
	type NotificationSettingItem,
	type NotificationSettingKind,
	notificationSettingKindSchema,
} from '@/types/apis/notification-settings';

import type { I18nFieldValue } from '@/types/i18n';

import {
	useCreateNotificationSettingItem,
	useGetNotificationSettingGroupList,
	useGetNotificationSettingItemList,
	useUpdateNotificationSettingItem,
} from '@/hooks/apis/notification-settings';

import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';
import DefaultEnabledIcon from '@/app/(main)/(backoffice)/notification-settings/_components/default-enabled-icon';
import NotificationSettingKindTag, {
	NOTIFICATION_SETTING_KINDS,
} from '@/app/(main)/(backoffice)/notification-settings/_components/notification-setting-kind-tag';
import NotificationSettingTextField from '@/app/(main)/(backoffice)/notification-settings/_components/notification-setting-text-field';
import { koreanOrEnglishText, toI18nFieldValue, toI18nText, toOptionalI18nText } from '@/utils/i18n-text';
import { toNotificationSettingTextError, toNotificationSettingTextUpdate } from '@/utils/notification-setting';

import ConfirmDialog from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

const rowClassName = 'grid gap-1.5 @md:grid-cols-[72px_minmax(0,1fr)] @md:gap-3';
const labelClassName = 'text-[13px] font-semibold text-muted-foreground';

interface Props {
	item?: NotificationSettingItem;
	onClose: () => void;
}

/**
 * 알림 설정 항목 추가 및 수정 다이얼로그 컴포넌트
 * @param item 수정할 항목
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const NotificationSettingItemFormDialog = ({ item, onClose }: Props) => {
	const { data: groupListData } = useGetNotificationSettingGroupList();
	const { data: itemListData } = useGetNotificationSettingItemList();

	const createItem = useCreateNotificationSettingItem();
	const updateItem = useUpdateNotificationSettingItem();

	const registeredKinds = itemListData.map((registeredItem) => registeredItem.kind);

	// 다이얼로그를 열 때 등록되지 않은 종류
	const [kindOptions] = useState(() =>
		notificationSettingKindSchema.options.filter((kindOption) => !registeredKinds.includes(kindOption)),
	);
	const [kind, setKind] = useState<NotificationSettingKind | undefined>(kindOptions[0]);
	const [kindError, setKindError] = useState('');
	const [defaultEnabled, setDefaultEnabled] = useState(false);
	const [groupId, setGroupId] = useState('');
	const [locale, setLocale] = useState<keyof I18nFieldValue>('ko_kr');
	const [title, setTitle] = useState(toI18nFieldValue(item?.title ?? null));
	const [description, setDescription] = useState(toI18nFieldValue(item?.description ?? null));
	const [textError, setTextError] = useState('');
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

	const defaultEnabledLabelId = useId();

	const saving = createItem.isPending || updateItem.isPending;

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !saving) {
			onClose();
		}
	};

	const handleKindChange = (nextKind: NotificationSettingKind) => {
		setKind(nextKind);
		setKindError('');
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

		// 다이얼로그를 연 뒤에 등록된 종류
		const nextKindError = !item && !!kind && registeredKinds.includes(kind) ? '이미 등록된 종류입니다.' : '';
		const nextTextError = toNotificationSettingTextError(title, description);

		setKindError(nextKindError);
		setTextError(nextTextError);

		// 빠진 영어 문구를 입력하도록 영어 선택
		if (nextTextError) {
			setLocale('en_us');
		}

		if (nextKindError || nextTextError) {
			return;
		}

		// 바뀐 값이 없는 수정은 요청 없이 닫음
		if (item && Object.keys(toNotificationSettingTextUpdate(title, description, item)).length === 0) {
			onClose();

			return;
		}

		setConfirmDialogOpen(true);
	};

	const handleSave = () => {
		if (saving) {
			return;
		}

		if (item) {
			// 수정은 바뀐 값만 보냄
			updateItem.mutate(
				{ id: item.id, data: toNotificationSettingTextUpdate(title, description, item) },
				{ onSuccess: onClose, onError: () => setConfirmDialogOpen(false) },
			);

			return;
		}

		// 종류 없는 추가는 위에서 막으므로 타입만 좁힌다
		if (!kind) {
			return;
		}

		createItem.mutate(
			{
				data: {
					group_id: groupId || null,
					kind,
					title: toI18nText(title),
					description: toOptionalI18nText(description),
					default_enabled: defaultEnabled,
				},
			},
			{
				onSuccess: onClose,
				onError: (error) => {
					setConfirmDialogOpen(false);

					if (error instanceof ApiError && error.code === 'NOTIFICATION_SETTING__DUPLICATE_KIND') {
						setKindError('이미 등록된 종류입니다.');
					}
				},
			},
		);
	};

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<DialogContent className="gap-0 p-0 sm:max-w-190">
				<form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
					<DialogHeader className="border-b px-6 py-4">
						<DialogTitle className="font-bold">{item ? '항목 수정' : '항목 추가'}</DialogTitle>
					</DialogHeader>

					<DialogBody className="@container grid content-start gap-3 px-4 pt-5 pb-6 md:px-6">
						<div className={`${rowClassName} @md:items-start`}>
							<span className={`${labelClassName} @md:pt-2`}>종류</span>

							{/*추가한 뒤에는 종류를 변경할 수 없음*/}
							{item ? (
								<div className="flex min-h-9 items-center">
									<NotificationSettingKindTag kind={item.kind} />
								</div>
							) : (
								<div>
									<SegmentedControl
										label="종류"
										options={kindOptions.map((kindOption) => ({
											value: kindOption,
											label: NOTIFICATION_SETTING_KINDS[kindOption].label,
											disabled: registeredKinds.includes(kindOption),
										}))}
										value={kind}
										className={kindError ? 'border-destructive' : undefined}
										onValueChange={handleKindChange}
									/>
									{!!kindError && (
										<p role="alert" className="mt-1.5 text-[13px] text-destructive">
											{kindError}
										</p>
									)}
								</div>
							)}
						</div>

						<div className={`${rowClassName} @md:items-center`}>
							<span id={defaultEnabledLabelId} className={labelClassName}>
								기본값
							</span>

							{/*추가한 뒤에는 기본값을 변경할 수 없음*/}
							<div className="flex min-h-9 items-center">
								{item ? (
									<DefaultEnabledIcon enabled={item.default_enabled} />
								) : (
									<Switch
										aria-labelledby={defaultEnabledLabelId}
										checked={defaultEnabled}
										onCheckedChange={setDefaultEnabled}
									/>
								)}
							</div>
						</div>

						{/*그룹 이동은 표에서 끌어서 저장*/}
						{!item && (
							<div className={`${rowClassName} @md:items-center`}>
								<span className={labelClassName}>그룹</span>

								<SegmentedControl
									label="그룹"
									options={[
										{ value: '', label: '미분류' },
										...groupListData.map((group) => ({
											value: group.id,
											label: koreanOrEnglishText(group.title),
										})),
									]}
									value={groupId}
									onValueChange={setGroupId}
								/>
							</div>
						)}

						<div className={`${rowClassName} mt-2 border-t pt-5 @md:items-start`}>
							<span className={`${labelClassName} @md:pt-2`}>내용</span>

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
							{item ? '저장' : '추가'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>

			<ConfirmDialog
				open={confirmDialogOpen}
				text={
					item
						? { title: '항목을 수정할까요?', confirm: '저장' }
						: { title: '항목을 추가할까요?', confirm: '추가' }
				}
				confirmVariant="default"
				busy={saving}
				onConfirm={handleSave}
				onClose={() => setConfirmDialogOpen(false)}
			/>
		</Dialog>
	);
};

export default NotificationSettingItemFormDialog;
