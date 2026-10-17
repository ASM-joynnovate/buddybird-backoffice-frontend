'use client';

import { type SubmitEvent, useState } from 'react';

import type { Announcement } from '@/types/apis/announcements';

import type { I18nFieldValue } from '@/types/i18n';

import { useCreateAnnouncement, useUpdateAnnouncement, useUploadAnnouncementImage } from '@/hooks/apis/announcements';

import dayjs from 'dayjs';

import DateTimePicker from '@/app/(main)/(backoffice)/_components/date-time-picker';
import LocaleFieldGroup from '@/app/(main)/(backoffice)/_components/locale-field-group';
import LocaleTextField from '@/app/(main)/(backoffice)/_components/locale-text-field';
import AnnouncementImageField, {
	type AnnouncementImageInput,
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

import ConfirmDialog from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const rowClassName = 'grid gap-1.5 @md:grid-cols-[72px_minmax(0,1fr)] @md:gap-3';
const labelClassName = 'text-[13px] font-semibold text-muted-foreground';
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
	const [locale, setLocale] = useState<keyof I18nFieldValue>('ko_kr');
	const [title, setTitle] = useState(toI18nFieldValue(announcement?.title ?? null));
	const [body, setBody] = useState(toI18nFieldValue(announcement?.body ?? null));
	const [englishTitleMissing, setEnglishTitleMissing] = useState(false);
	const [englishBodyMissing, setEnglishBodyMissing] = useState(false);

	const [images, setImages] = useState<AnnouncementImageInput[]>(() =>
		(announcement?.images ?? []).map((image) => ({ url: image.url, fileId: image.file_id })),
	);

	const [startsAt, setStartsAt] = useState(announcement ? toDateTimeInputValue(announcement.starts_at) : '');
	const [endsAt, setEndsAt] = useState(announcement?.ends_at ? toDateTimeInputValue(announcement.ends_at) : '');
	const [endsAtInvalid, setEndsAtInvalid] = useState(false);

	const [pushSetting, setPushSetting] = useState<PushSetting>({
		enabled: announcement?.push_enabled ?? false,
		timeSpecified: !!announcement?.push_local_time,
		localTime: announcement?.push_local_time ? toHourMinute(announcement.push_local_time) : DEFAULT_PUSH_LOCAL_TIME,
	});

	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const createAnnouncement = useCreateAnnouncement();
	const updateAnnouncement = useUpdateAnnouncement();
	const uploadAnnouncementImage = useUploadAnnouncementImage();

	const saving = createAnnouncement.isPending || updateAnnouncement.isPending;
	const uploading = images.some((image) => !image.fileId);

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !saving) {
			onClose();
		}
	};

	const handleTitleChange = (localeTitle: string) => {
		setTitle((prev) => ({ ...prev, [locale]: localeTitle }));
		setEnglishTitleMissing(false);
	};

	const handleBodyChange = (localeBody: string) => {
		setBody((prev) => ({ ...prev, [locale]: localeBody }));
		setEnglishBodyMissing(false);
	};

	// 선택한 사진은 바로 업로드
	const handleImagePick = (file: File) => {
		const url = URL.createObjectURL(file);

		setImages((prev) => [...prev, { url, fileId: null }]);

		uploadAnnouncementImage
			.mutateAsync({ file })
			.then((fileId) => setImages((prev) => prev.map((image) => (image.url === url ? { url, fileId } : image))))
			.catch(() => {
				URL.revokeObjectURL(url);
				setImages((prev) => prev.filter((image) => image.url !== url));
			});
	};

	const handleStartsAtChange = (value: string) => {
		setStartsAt(value);
		setEndsAtInvalid(false);
	};

	const handleEndsAtChange = (value: string) => {
		setEndsAt(value);
		setEndsAtInvalid(false);
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (saving || uploading) {
			return;
		}

		const nextEnglishTitleMissing = !title.en_us.trim();
		const nextEnglishBodyMissing = englishTextMissing(body);
		const nextEndsAtInvalid = !!endsAt && !dayjs(endsAt).isAfter(startsAt);

		setEnglishTitleMissing(nextEnglishTitleMissing);
		setEnglishBodyMissing(nextEnglishBodyMissing);
		setEndsAtInvalid(nextEndsAtInvalid);

		// 빠진 영어 문구를 입력하도록 영어 선택
		if (nextEnglishTitleMissing || nextEnglishBodyMissing) {
			setLocale('en_us');
		}

		if (nextEnglishTitleMissing || nextEnglishBodyMissing || nextEndsAtInvalid) {
			return;
		}

		setConfirmDialogOpen(true);
	};

	const handleSave = () => {
		if (saving) {
			return;
		}

		const announcementRequest = {
			title: toI18nText(title),
			body: toOptionalI18nText(body),
			starts_at: toTimestamp(startsAt),
			ends_at: endsAt ? toTimestamp(endsAt) : null,
			image_file_ids: images.flatMap((image) => (image.fileId ? [image.fileId] : [])),
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
				{ onSuccess: onClose, onError: () => setConfirmDialogOpen(false) },
			);

			return;
		}

		createAnnouncement.mutate(
			{ data: { ...announcementRequest, ...pushRequest } },
			{ onSuccess: onClose, onError: () => setConfirmDialogOpen(false) },
		);
	};

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<DialogContent className="gap-0 p-0 sm:max-w-280">
				<form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
					<DialogHeader className="border-b px-6 py-4">
						<DialogTitle className="font-bold">{announcement ? '공지 수정' : '공지 작성'}</DialogTitle>
					</DialogHeader>

					<DialogBody className="grid md:min-h-140 md:grid-cols-[minmax(0,1fr)_420px]">
						<div className="@container grid content-start gap-3 px-4 pt-5 pb-6 md:px-6">
							{/*선택한 언어의 제목 및 본문을 한 상자에 입력*/}
							<div className={rowClassName}>
								<span className={`${labelClassName} @md:pt-2.5`}>내용</span>

								<div>
									<LocaleFieldGroup
										locale={locale}
										summaryTexts={title}
										englishRequired
										onLocaleChange={setLocale}
									>
										<LocaleTextField
											locale={locale}
											title={title[locale]}
											body={body[locale]}
											englishBodyRequired={false}
											lengthText={`제목 ${title[locale].length}/${TITLE_MAX_LENGTH}`}
											onTitleChange={handleTitleChange}
											onBodyChange={handleBodyChange}
										/>
									</LocaleFieldGroup>

									{(englishTitleMissing || englishBodyMissing) && (
										<p role="alert" className="mt-1.5 text-[13px] text-destructive">
											{englishTitleMissing
												? '영어 제목을 입력해 주세요.'
												: '영어 본문을 입력해 주세요.'}
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
									images={images}
									onImagePick={handleImagePick}
									onImagesChange={setImages}
								/>
							</div>

							<div className={`${rowClassName} mt-2 border-t pt-5`}>
								<span className={`${labelClassName} @md:pt-2.5`}>게시 기간</span>

								<div>
									<div className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
										<DateTimePicker
											value={startsAt}
											ariaLabel="게시 시작"
											required
											onValueChange={handleStartsAtChange}
										/>
										~
										<DateTimePicker
											value={endsAt}
											ariaLabel="게시 종료"
											invalid={endsAtInvalid}
											onValueChange={handleEndsAtChange}
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
							imageUrl={images[0]?.url}
							pushEnabled={pushSetting.enabled}
							locale={locale}
						/>
					</DialogBody>

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
						{/*사진 업로드가 끝나야 저장 가능*/}
						<Button type="submit" loading={saving} disabled={uploading}>
							저장
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>

			<ConfirmDialog
				open={confirmDialogOpen}
				text={
					announcement
						? { title: '공지를 수정할까요?', confirm: '저장' }
						: { title: '공지를 게시할까요?', confirm: '게시' }
				}
				confirmVariant="default"
				busy={saving}
				onConfirm={handleSave}
				onClose={() => setConfirmDialogOpen(false)}
			/>

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
