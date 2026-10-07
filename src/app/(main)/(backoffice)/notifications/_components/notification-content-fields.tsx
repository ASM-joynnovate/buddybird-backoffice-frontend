'use client';

import type { Dispatch, SetStateAction } from 'react';

import { type SendableNotificationKind, sendableNotificationKindSchema } from '@/types/apis/notifications';

import type { I18nFieldValue } from '@/types/i18n';

import NotificationImageField from '@/app/(main)/(backoffice)/notifications/_components/notification-image-field';
import { NOTIFICATION_BODY_MAX_LENGTH, TITLE_MAX_LENGTH } from '@/config';
import { toI18nFieldValue } from '@/utils/i18n-text';

import I18nField from '@/components/i18n-field';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface NotificationContent {
	kind: SendableNotificationKind | null;
	title: I18nFieldValue;
	body: I18nFieldValue;
	imageFileId: string | null;
}

export const initialNotificationContent: NotificationContent = {
	kind: null,
	title: toI18nFieldValue(null),
	body: toI18nFieldValue(null),
	imageFileId: null,
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
			<div className="grid gap-2">
				<Label htmlFor="notification-kind">종류</Label>
				<Select
					id="notification-kind"
					name="kind"
					required
					value={content.kind}
					onValueChange={(kind) => onContentChange((prev) => ({ ...prev, kind }))}
				>
					<SelectTrigger>
						<SelectValue placeholder="종류 선택" />
					</SelectTrigger>
					<SelectContent>
						{sendableNotificationKindSchema.options.map((sendableNotificationKind) => (
							<SelectItem key={sendableNotificationKind} value={sendableNotificationKind}>
								{sendableNotificationKind}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<I18nField
				legend="제목"
				value={content.title}
				rule={{ required: true, maxLength: TITLE_MAX_LENGTH }}
				onValueChange={(title) => onContentChange((prev) => ({ ...prev, title }))}
			/>

			<I18nField
				legend="본문"
				value={content.body}
				rule={{ required: true, maxLength: NOTIFICATION_BODY_MAX_LENGTH }}
				multiline
				onValueChange={(body) => onContentChange((prev) => ({ ...prev, body }))}
			/>

			<NotificationImageField
				imageFileId={content.imageFileId}
				onImageFileIdChange={(imageFileId) => onContentChange((prev) => ({ ...prev, imageFileId }))}
			/>
		</>
	);
};

export default NotificationContentFields;
