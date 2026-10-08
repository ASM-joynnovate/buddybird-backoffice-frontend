'use client';

import { type ChangeEvent, type SubmitEvent, useState } from 'react';

import type { Announcement } from '@/types/apis/announcements';

import type { I18nFieldValue } from '@/types/i18n';

import { useCreateAnnouncement, useSaveAnnouncementImages, useUpdateAnnouncement } from '@/hooks/apis/announcements';

import dayjs from 'dayjs';

import LocaleTextField from '@/app/(main)/(backoffice)/_components/locale-text-field';
import AnnouncementImageField, {
	type PickedImage,
} from '@/app/(main)/(backoffice)/announcements/_components/announcement-image-field';
import AnnouncementPreview from '@/app/(main)/(backoffice)/announcements/_components/announcement-preview';
import AnnouncementPushField, {
	type PushSetting,
} from '@/app/(main)/(backoffice)/announcements/_components/announcement-push-field';
import AnnouncementPushStatus from '@/app/(main)/(backoffice)/announcements/_components/announcement-push-status';
import DeleteAnnouncementDialog from '@/app/(main)/(backoffice)/announcements/_components/delete-announcement-dialog';
import { DEFAULT_PUSH_LOCAL_TIME, TITLE_MAX_LENGTH } from '@/config';
import { toDateTimeInputValue, toHourMinute, toTimestamp } from '@/utils/date';
import { englishTextMissing, toI18nFieldValue, toI18nText, toOptionalI18nText } from '@/utils/i18n-text';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const rowClassName = 'grid gap-1.5 @md:grid-cols-[72px_minmax(0,1fr)] @md:gap-3';
const labelClassName = 'text-[13px] font-semibold text-muted-foreground';
const dateTimeInputClassName =
	'h-7 rounded-sm bg-transparent px-1 font-semibold text-foreground tabular-nums hover:bg-muted';

interface Props {
	announcement?: Announcement;
	onClose: () => void;
}

/**
 * 공지 작성 및 수정 다이얼로그 컴포넌트
 * @param announcement 수정할 공지
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const AnnouncementFormDialog = ({ announcement, onClose }: Props) => {
	const [title, setTitle] = useState(toI18nFieldValue(announcement?.title ?? null));
	const [body, setBody] = useState(toI18nFieldValue(announcement?.body ?? null));
	const [englishBodyMissing, setEnglishBodyMissing] = useState(false);

	const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
	const [pickedImages, setPickedImages] = useState<PickedImage[]>([]);

	const [startsAt, setStartsAt] = useState(announcement ? toDateTimeInputValue(announcement.starts_at) : '');
	const [endsAt, setEndsAt] = useState(announcement?.ends_at ? toDateTimeInputValue(announcement.ends_at) : '');
	const [endsAtInvalid, setEndsAtInvalid] = useState(false);

	const [pushSetting, setPushSetting] = useState<PushSetting>({
		enabled: announcement?.push_enabled ?? false,
		timeSpecified: !!announcement?.push_local_time,
		localTime: announcement?.push_local_time ? toHourMinute(announcement.push_local_time) : DEFAULT_PUSH_LOCAL_TIME,
	});

	const [previewLocale, setPreviewLocale] = useState<keyof I18nFieldValue>('ko_kr');
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const createAnnouncement = useCreateAnnouncement();
	const updateAnnouncement = useUpdateAnnouncement();
	const saveAnnouncementImages = useSaveAnnouncementImages();

	const saving = createAnnouncement.isPending || updateAnnouncement.isPending || saveAnnouncementImages.isPending;
	const savedImages = (announcement?.images ?? []).filter((image) => !deletedImageIds.includes(image.id));

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !saving) {
			onClose();
		}
	};

	const handleBodyChange = (locale: keyof I18nFieldValue, localeBody: string) => {
		setBody((prev) => ({ ...prev, [locale]: localeBody }));
		setEnglishBodyMissing(false);
	};

	const handlePickedImageRemove = (removedImage: PickedImage) => {
		URL.revokeObjectURL(removedImage.url);

		setPickedImages((prev) => prev.filter((pickedImage) => pickedImage !== removedImage));
	};

	const handleStartsAtChange = (event: ChangeEvent<HTMLInputElement>) => {
		setStartsAt(event.target.value);
		setEndsAtInvalid(false);
	};

	const handleEndsAtChange = (event: ChangeEvent<HTMLInputElement>) => {
		setEndsAt(event.target.value);
		setEndsAtInvalid(false);
	};

	/** 저장한 공지에 사진 변경을 반영 */
	const saveImages = ({ id }: Announcement) => {
		if (deletedImageIds.length === 0 && pickedImages.length === 0) {
			onClose();

			return;
		}

		saveAnnouncementImages.mutate(
			{ id, deletedImageIds, addedImageFiles: pickedImages.map(({ file }) => file) },
			{ onSettled: onClose },
		);
	};

	const handleSave = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (saving) {
			return;
		}

		const nextEnglishBodyMissing = englishTextMissing(body);
		const nextEndsAtInvalid = !!endsAt && !dayjs(endsAt).isAfter(startsAt);

		setEnglishBodyMissing(nextEnglishBodyMissing);
		setEndsAtInvalid(nextEndsAtInvalid);

		if (nextEnglishBodyMissing || nextEndsAtInvalid) {
			return;
		}

		const announcementRequest = {
			title: toI18nText(title),
			body: toOptionalI18nText(body),
			starts_at: toTimestamp(startsAt),
			ends_at: endsAt ? toTimestamp(endsAt) : null,
		};
		const pushRequest = {
			push_enabled: pushSetting.enabled,
			push_local_time: pushSetting.enabled && pushSetting.timeSpecified ? pushSetting.localTime : null,
		};

		if (announcement) {
			updateAnnouncement.mutate(
				{
					id: announcement.id,
					// 푸시를 만든 공지는 푸시 설정 제외
					data: announcement.push_prepared_at
						? announcementRequest
						: { ...announcementRequest, ...pushRequest },
				},
				{ onSuccess: saveImages },
			);

			return;
		}

		createAnnouncement.mutate({ data: { ...announcementRequest, ...pushRequest } }, { onSuccess: saveImages });
	};

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<DialogContent className="gap-0 p-0 sm:max-w-280">
				<form onSubmit={handleSave}>
					<DialogHeader className="border-b px-6 py-4">
						<DialogTitle className="font-bold">{announcement ? '공지 수정' : '공지 작성'}</DialogTitle>
					</DialogHeader>

					<div className="grid md:min-h-140 md:grid-cols-[minmax(0,1fr)_420px]">
						<div className="@container grid content-start gap-3 px-4 pt-5 pb-6 md:px-6">
							{/*언어마다 제목 및 본문을 한 상자에 입력*/}
							<div className={rowClassName}>
								<span className={`${labelClassName} @md:pt-2.5`}>내용</span>

								<div>
									<div className="grid gap-3 @md:grid-cols-2">
										<LocaleTextField
											locale="ko_kr"
											title={title.ko_kr}
											body={body.ko_kr}
											englishBodyRequired={false}
											lengthText={`제목 ${title.ko_kr.length}/${TITLE_MAX_LENGTH}`}
											onTitleChange={(ko_kr) => setTitle((prev) => ({ ...prev, ko_kr }))}
											onBodyChange={(ko_kr) => handleBodyChange('ko_kr', ko_kr)}
											onFocus={() => setPreviewLocale('ko_kr')}
										/>
										<LocaleTextField
											locale="en_us"
											title={title.en_us}
											body={body.en_us}
											englishBodyRequired={false}
											lengthText={`제목 ${title.en_us.length}/${TITLE_MAX_LENGTH}`}
											onTitleChange={(en_us) => setTitle((prev) => ({ ...prev, en_us }))}
											onBodyChange={(en_us) => handleBodyChange('en_us', en_us)}
											onFocus={() => setPreviewLocale('en_us')}
										/>
									</div>

									{englishBodyMissing && (
										<p role="alert" className="mt-1.5 text-[13px] text-destructive">
											영어 본문을 입력해 주세요.
										</p>
									)}
								</div>
							</div>

							<div className={rowClassName}>
								<span className={`${labelClassName} @md:pt-2.5`}>
									사진
									<span className="ml-1 text-xs font-normal">선택</span>
								</span>

								<AnnouncementImageField
									savedImages={savedImages}
									pickedImages={pickedImages}
									onSavedImageDelete={(imageId) => setDeletedImageIds((prev) => [...prev, imageId])}
									onImagePick={(pickedImage) => setPickedImages((prev) => [...prev, pickedImage])}
									onPickedImageRemove={handlePickedImageRemove}
								/>
							</div>

							<div className={`${rowClassName} mt-2 border-t pt-5`}>
								<span className={`${labelClassName} @md:pt-2.5`}>게시 기간</span>

								<div>
									<div className="inline-flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border bg-card px-1.5 py-0.5 text-muted-foreground">
										<input
											type="datetime-local"
											aria-label="게시 시작"
											required
											value={startsAt}
											className={dateTimeInputClassName}
											onChange={handleStartsAtChange}
										/>
										~
										<input
											type="datetime-local"
											aria-label="게시 종료"
											value={endsAt}
											aria-invalid={endsAtInvalid}
											className={dateTimeInputClassName}
											onChange={handleEndsAtChange}
										/>
									</div>

									<p className="mt-2 text-[13px] text-muted-foreground">
										종료를 비워 두면 계속 게시합니다.
									</p>

									{endsAtInvalid && (
										<p role="alert" className="mt-1.5 text-[13px] text-destructive">
											게시 종료는 게시 시작보다 늦어야 합니다.
										</p>
									)}
								</div>
							</div>

							<div className={`${rowClassName} items-center`}>
								<span className={labelClassName}>푸시</span>

								{/*푸시를 만든 공지는 발송 결과만 표시*/}
								{announcement?.push_prepared_at ? (
									<p className="flex min-h-9 items-center">
										<AnnouncementPushStatus announcement={announcement} />
									</p>
								) : (
									<AnnouncementPushField
										pushSetting={pushSetting}
										onPushSettingChange={setPushSetting}
									/>
								)}
							</div>
						</div>

						<AnnouncementPreview
							title={title}
							body={body}
							imageUrl={savedImages[0]?.url ?? pickedImages[0]?.url}
							pushEnabled={pushSetting.enabled}
							locale={previewLocale}
							onLocaleChange={setPreviewLocale}
						/>
					</div>

					<DialogFooter className="m-0 rounded-none border-t bg-card px-6 py-4">
						{!!announcement && (
							<Button
								type="button"
								variant="destructive"
								className="sm:mr-auto"
								disabled={saving}
								onClick={() => setDeleteDialogOpen(true)}
							>
								삭제
							</Button>
						)}
						<Button type="button" variant="outline" disabled={saving} onClick={onClose}>
							취소
						</Button>
						<Button type="submit" disabled={saving}>
							저장
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>

			{!!announcement && (
				<DeleteAnnouncementDialog
					open={deleteDialogOpen}
					announcement={announcement}
					onClose={() => setDeleteDialogOpen(false)}
					onDelete={onClose}
				/>
			)}
		</Dialog>
	);
};

export default AnnouncementFormDialog;
