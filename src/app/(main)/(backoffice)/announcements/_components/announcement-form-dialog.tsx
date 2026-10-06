'use client';

import { type ChangeEvent, type SubmitEvent, useState } from 'react';

import type { Announcement } from '@/types/apis/announcements';

import type { I18nFieldValue } from '@/types/i18n';

import { useCreateAnnouncement, useUpdateAnnouncement } from '@/hooks/apis/announcements';

import dayjs from 'dayjs';

import { TITLE_MAX_LENGTH } from '@/config';
import { toDateTimeInputValue, toTimestamp } from '@/utils/date';
import { englishTextMissing, toI18nFieldValue, toI18nText, toOptionalI18nText } from '@/utils/i18n-text';

import I18nField from '@/components/i18n-field';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
	announcement?: Announcement;
	onClose: () => void;
}

/**
 * 공지 생성 및 수정 다이얼로그 컴포넌트
 * @param announcement 수정할 공지
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const AnnouncementFormDialog = ({ announcement, onClose }: Props) => {
	const [title, setTitle] = useState(toI18nFieldValue(announcement?.title ?? null));
	const [body, setBody] = useState(toI18nFieldValue(announcement?.body ?? null));
	const [startsAt, setStartsAt] = useState(announcement ? toDateTimeInputValue(announcement.starts_at) : '');
	const [endsAt, setEndsAt] = useState(announcement?.ends_at ? toDateTimeInputValue(announcement.ends_at) : '');
	const [pushEnabled, setPushEnabled] = useState(false);
	const [pushLocalTime, setPushLocalTime] = useState('');
	const [englishBodyMissing, setEnglishBodyMissing] = useState(false);
	const [endsAtInvalid, setEndsAtInvalid] = useState(false);

	const createAnnouncement = useCreateAnnouncement();
	const updateAnnouncement = useUpdateAnnouncement();

	const saving = createAnnouncement.isPending || updateAnnouncement.isPending;

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !saving) {
			onClose();
		}
	};

	const handleBodyChange = (nextBody: I18nFieldValue) => {
		setBody(nextBody);
		setEnglishBodyMissing(false);
	};

	const handleStartsAtChange = (event: ChangeEvent<HTMLInputElement>) => {
		setStartsAt(event.target.value);
		setEndsAtInvalid(false);
	};

	const handleEndsAtChange = (event: ChangeEvent<HTMLInputElement>) => {
		setEndsAt(event.target.value);
		setEndsAtInvalid(false);
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

		if (announcement) {
			updateAnnouncement.mutate({ id: announcement.id, data: announcementRequest }, { onSuccess: onClose });

			return;
		}

		createAnnouncement.mutate(
			{ data: { ...announcementRequest, push_enabled: pushEnabled, push_local_time: pushLocalTime || null } },
			{ onSuccess: onClose },
		);
	};

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<DialogContent>
				<form onSubmit={handleSave} className="space-y-4">
					<DialogHeader>
						<DialogTitle>{announcement ? '공지 수정' : '공지 생성'}</DialogTitle>
					</DialogHeader>

					<I18nField
						legend="제목"
						value={title}
						rule={{ required: true, maxLength: TITLE_MAX_LENGTH }}
						onValueChange={setTitle}
					/>

					<div className="space-y-2">
						<I18nField legend="본문" value={body} multiline onValueChange={handleBodyChange} />
						{englishBodyMissing && (
							<p role="alert" className="text-sm text-destructive">
								영어 본문을 입력해 주세요.
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="starts-at">게시 시작</Label>
						<Input
							id="starts-at"
							type="datetime-local"
							required
							value={startsAt}
							onChange={handleStartsAtChange}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="ends-at">게시 종료</Label>
						<Input
							id="ends-at"
							type="datetime-local"
							value={endsAt}
							aria-invalid={endsAtInvalid}
							onChange={handleEndsAtChange}
						/>
						{endsAtInvalid && (
							<p role="alert" className="text-sm text-destructive">
								게시 종료는 게시 시작보다 늦어야 합니다.
							</p>
						)}
					</div>

					{!announcement && (
						<>
							<div className="flex items-center gap-2">
								<Checkbox id="push-enabled" checked={pushEnabled} onCheckedChange={setPushEnabled} />
								<Label htmlFor="push-enabled">푸시 발송</Label>
							</div>

							<div className="space-y-2">
								<Label htmlFor="push-local-time">푸시 발송 시각</Label>
								<Input
									id="push-local-time"
									type="time"
									value={pushLocalTime}
									onChange={(event) => setPushLocalTime(event.target.value)}
								/>
							</div>
						</>
					)}

					<DialogFooter>
						<Button type="button" variant="outline" disabled={saving} onClick={onClose}>
							취소
						</Button>
						<Button type="submit" disabled={saving}>
							저장
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AnnouncementFormDialog;
