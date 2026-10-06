'use client';

import { type SubmitEvent, useState } from 'react';

import type { Consent } from '@/types/apis/consents';

import { useCreateConsent, useUpdateConsent } from '@/hooks/apis/consents';

import { CONSENT_KIND_MAX_LENGTH, TITLE_MAX_LENGTH } from '@/config';
import { toDateTimeInputValue, toTimestamp } from '@/utils/date';
import { toI18nFieldValue, toI18nText } from '@/utils/i18n-text';

import I18nField from '@/components/i18n-field';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
	consent?: Consent;
	onClose: () => void;
}

/**
 * 고지문 생성 및 수정 다이얼로그 컴포넌트
 * @param consent 수정할 고지문
 * @param onClose 다이얼로그를 닫을 때 실행할 함수
 */
const ConsentFormDialog = ({ consent, onClose }: Props) => {
	const [kind, setKind] = useState('');
	const [title, setTitle] = useState(toI18nFieldValue(consent?.title ?? null));
	const [body, setBody] = useState(toI18nFieldValue(consent?.body ?? null));
	const [consentRequired, setConsentRequired] = useState(consent?.is_required ?? false);
	const [publishedAt, setPublishedAt] = useState(consent ? toDateTimeInputValue(consent.published_at) : '');

	const createConsent = useCreateConsent();
	const updateConsent = useUpdateConsent();

	const saving = createConsent.isPending || updateConsent.isPending;

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen && !saving) {
			onClose();
		}
	};

	const handleSave = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (saving) {
			return;
		}

		const consentRequest = {
			title: toI18nText(title),
			body: toI18nText(body),
			is_required: consentRequired,
			published_at: toTimestamp(publishedAt),
		};

		if (consent) {
			updateConsent.mutate({ id: consent.id, data: consentRequest }, { onSuccess: onClose });

			return;
		}

		createConsent.mutate({ data: { ...consentRequest, kind } }, { onSuccess: onClose });
	};

	return (
		<Dialog open onOpenChange={handleOpenChange}>
			<DialogContent>
				<form onSubmit={handleSave} className="space-y-4">
					<DialogHeader>
						<DialogTitle>{consent ? '고지문 수정' : '고지문 생성'}</DialogTitle>
					</DialogHeader>

					{consent ? (
						<p className="text-sm text-muted-foreground">종류: {consent.kind}</p>
					) : (
						<div className="space-y-2">
							<Label htmlFor="kind">종류</Label>
							<Input
								id="kind"
								required
								maxLength={CONSENT_KIND_MAX_LENGTH}
								value={kind}
								onChange={(event) => setKind(event.target.value)}
							/>
						</div>
					)}

					<I18nField
						legend="제목"
						value={title}
						rule={{ required: true, maxLength: TITLE_MAX_LENGTH }}
						onValueChange={setTitle}
					/>

					<I18nField legend="본문" value={body} rule={{ required: true }} multiline onValueChange={setBody} />

					<div className="flex items-center gap-2">
						<Checkbox id="is-required" checked={consentRequired} onCheckedChange={setConsentRequired} />
						<Label htmlFor="is-required">필수 여부</Label>
					</div>

					<div className="space-y-2">
						<Label htmlFor="published-at">게시 일시</Label>
						<Input
							id="published-at"
							type="datetime-local"
							required
							value={publishedAt}
							onChange={(event) => setPublishedAt(event.target.value)}
						/>
					</div>

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

export default ConsentFormDialog;
