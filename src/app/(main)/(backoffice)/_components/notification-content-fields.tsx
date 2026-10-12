'use client';

import type { Dispatch, SetStateAction } from 'react';

import { type SendableNotificationKind, sendableNotificationKindSchema } from '@/types/apis/notifications';

import type { I18nFieldValue } from '@/types/i18n';

import LocaleFieldGroup from '@/app/(main)/(backoffice)/_components/locale-field-group';
import LocaleTextField from '@/app/(main)/(backoffice)/_components/locale-text-field';
import NotificationImageField from '@/app/(main)/(backoffice)/_components/notification-image-field';
import { NOTIFICATION_KINDS } from '@/app/(main)/(backoffice)/_components/notification-kind-tag';
import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';
import { NOTIFICATION_BODY_MAX_LENGTH, TITLE_MAX_LENGTH } from '@/config';
import { toI18nFieldValue } from '@/utils/i18n-text';

const rowClassName = 'grid gap-1.5 @md:grid-cols-[72px_minmax(0,1fr)] @md:gap-3';
const labelClassName = 'text-[13px] font-semibold text-muted-foreground';

export interface NotificationContent {
	kind: SendableNotificationKind;
	title: I18nFieldValue;
	body: I18nFieldValue;
	imageFileId: string | null;
	imageFile: File | null;
	imagePreviewUrl: string | null;
}

export const initialNotificationContent: NotificationContent = {
	kind: 'announcement',
	title: toI18nFieldValue(null),
	body: toI18nFieldValue(null),
	imageFileId: null,
	imageFile: null,
	imagePreviewUrl: null,
};

interface Props {
	content: NotificationContent;
	locale: keyof I18nFieldValue;
	englishTextMissing: boolean;
	onContentChange: Dispatch<SetStateAction<NotificationContent>>;
	onLocaleChange: (locale: keyof I18nFieldValue) => void;
}

/**
 * 알림 내용 입력 컴포넌트
 * @param content 알림 내용 입력값
 * @param locale 입력할 언어
 * @param englishTextMissing 영어 제목이나 본문이 빠졌는지 여부
 * @param onContentChange 입력값을 변경할 때 실행할 함수
 * @param onLocaleChange 언어를 선택하면 실행할 함수
 */
const NotificationContentFields = ({ content, locale, englishTextMissing, onContentChange, onLocaleChange }: Props) => {
	return (
		<>
			<div className={`${rowClassName} items-center`}>
				<span className={labelClassName}>종류</span>

				<SegmentedControl
					label="종류"
					options={sendableNotificationKindSchema.options.map((sendableNotificationKind) => ({
						value: sendableNotificationKind,
						label: (
							<>
								<span
									className="size-2 rounded-full"
									style={{ backgroundColor: NOTIFICATION_KINDS[sendableNotificationKind].color }}
								/>
								{NOTIFICATION_KINDS[sendableNotificationKind].label}
							</>
						),
					}))}
					value={content.kind}
					onValueChange={(kind) => onContentChange((prev) => ({ ...prev, kind }))}
				/>
			</div>

			{/*선택한 언어의 제목 및 본문을 한 상자에 입력*/}
			<div className={`${rowClassName} mt-2 border-t pt-5`}>
				<span className={`${labelClassName} @md:pt-2.5`}>내용</span>

				<div>
					<LocaleFieldGroup
						locale={locale}
						summaryTexts={content.title}
						englishRequired
						onLocaleChange={onLocaleChange}
					>
						<LocaleTextField
							locale={locale}
							title={content.title[locale]}
							body={content.body[locale]}
							bodyMaxLength={NOTIFICATION_BODY_MAX_LENGTH}
							englishBodyRequired
							lengthText={`${content.title[locale].length}/${TITLE_MAX_LENGTH}, ${content.body[locale].length}/${NOTIFICATION_BODY_MAX_LENGTH}`}
							onTitleChange={(localeTitle) =>
								onContentChange((prev) => ({
									...prev,
									title: { ...prev.title, [locale]: localeTitle },
								}))
							}
							onBodyChange={(localeBody) =>
								onContentChange((prev) => ({ ...prev, body: { ...prev.body, [locale]: localeBody } }))
							}
						/>
					</LocaleFieldGroup>

					{englishTextMissing && (
						<p role="alert" className="mt-1.5 text-[13px] text-destructive">
							영어 제목 및 본문을 입력해 주세요.
						</p>
					)}
				</div>
			</div>

			<div className={rowClassName}>
				<span className={`${labelClassName} @md:pt-2.5`}>
					사진
					<span className="ml-1 text-xs font-normal">선택</span>
				</span>

				<NotificationImageField
					imagePreviewUrl={content.imagePreviewUrl}
					// 복사한 사진 대신 고른 사진 사용
					onImageChange={(image) => onContentChange((prev) => ({ ...prev, ...image, imageFileId: null }))}
				/>
			</div>
		</>
	);
};

export default NotificationContentFields;
