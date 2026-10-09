'use client';

import type { Dispatch, SetStateAction } from 'react';

import { type SendableNotificationKind, sendableNotificationKindSchema } from '@/types/apis/notifications';

import type { I18nFieldValue } from '@/types/i18n';

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
	onContentChange: Dispatch<SetStateAction<NotificationContent>>;
}

/**
 * 알림 내용 입력 컴포넌트
 * @param content 알림 내용 입력값
 * @param onContentChange 입력값을 변경할 때 실행할 함수
 */
const NotificationContentFields = ({ content, onContentChange }: Props) => {
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

			{/*언어마다 제목 및 본문을 한 상자에 입력*/}
			<div className={`${rowClassName} mt-2 border-t pt-5`}>
				<span className={`${labelClassName} @md:pt-2.5`}>내용</span>

				<div className="grid gap-3 @md:grid-cols-2">
					<LocaleTextField
						locale="ko_kr"
						title={content.title.ko_kr}
						body={content.body.ko_kr}
						bodyMaxLength={NOTIFICATION_BODY_MAX_LENGTH}
						englishBodyRequired
						lengthText={`${content.title.ko_kr.length}/${TITLE_MAX_LENGTH}, ${content.body.ko_kr.length}/${NOTIFICATION_BODY_MAX_LENGTH}`}
						onTitleChange={(ko_kr) =>
							onContentChange((prev) => ({ ...prev, title: { ...prev.title, ko_kr } }))
						}
						onBodyChange={(ko_kr) =>
							onContentChange((prev) => ({ ...prev, body: { ...prev.body, ko_kr } }))
						}
					/>
					<LocaleTextField
						locale="en_us"
						title={content.title.en_us}
						body={content.body.en_us}
						bodyMaxLength={NOTIFICATION_BODY_MAX_LENGTH}
						englishBodyRequired
						lengthText={`${content.title.en_us.length}/${TITLE_MAX_LENGTH}, ${content.body.en_us.length}/${NOTIFICATION_BODY_MAX_LENGTH}`}
						onTitleChange={(en_us) =>
							onContentChange((prev) => ({ ...prev, title: { ...prev.title, en_us } }))
						}
						onBodyChange={(en_us) =>
							onContentChange((prev) => ({ ...prev, body: { ...prev.body, en_us } }))
						}
					/>
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
