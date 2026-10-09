'use client';

import { type SubmitEvent, useId, useState } from 'react';

import { useRouter } from 'next/navigation';

import type { Consent } from '@/types/apis/consents';

import { useCreateConsent, useUpdateConsent } from '@/hooks/apis/consents';

import { TriangleAlert } from 'lucide-react';

import DateTimePicker from '@/app/(main)/(backoffice)/_components/date-time-picker';
import LocaleTextField from '@/app/(main)/(backoffice)/_components/locale-text-field';
import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';
import { CONSENT_KIND_MAX_LENGTH, TITLE_MAX_LENGTH } from '@/config';
import { toPublishNotice } from '@/utils/consent';
import { toDateTimeInputValue, toTimestamp } from '@/utils/date';
import { koreanOrEnglishText, toI18nFieldValue, toI18nText } from '@/utils/i18n-text';

import ConfirmDialog from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const rowClassName = 'grid gap-1.5 md:grid-cols-[72px_minmax(0,1fr)] md:items-center md:gap-3';
const labelClassName = 'text-[13px] font-semibold text-muted-foreground';
const bodyClassName = 'h-80 min-h-30 resize-y leading-[1.75] max-md:h-55';

export type ConsentFormMode = 'newConsent' | 'newVersion' | 'edit';

interface Props {
	formMode: ConsentFormMode;
	sourceConsent?: Consent;
	liveConsentExists: boolean;
	onClose: () => void;
}

/**
 * 고지문 입력 폼 컴포넌트
 * @param formMode 입력 폼의 종류
 * @param sourceConsent 처음 입력값으로 사용할 버전
 * @param liveConsentExists 같은 종류에 게시 중인 버전이 있는지 여부
 * @param onClose 폼을 닫을 때 실행할 함수
 */
const ConsentForm = ({ formMode, sourceConsent, liveConsentExists, onClose }: Props) => {
	const router = useRouter();

	const [kind, setKind] = useState('');
	const [title, setTitle] = useState(toI18nFieldValue(sourceConsent?.title ?? null));
	const [body, setBody] = useState(toI18nFieldValue(sourceConsent?.body ?? null));
	const [required, setRequired] = useState(sourceConsent?.is_required ?? true);
	const [publishedAt, setPublishedAt] = useState(
		formMode === 'edit' && sourceConsent ? toDateTimeInputValue(sourceConsent.published_at) : '',
	);
	const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

	const kindInputId = useId();
	const publishedAtInputId = useId();

	const createConsent = useCreateConsent();
	const updateConsent = useUpdateConsent();

	const saving = createConsent.isPending || updateConsent.isPending;

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (saving) {
			return;
		}

		setConfirmDialogOpen(true);
	};

	const handleSave = () => {
		if (saving) {
			return;
		}

		const consentRequest = {
			title: toI18nText(title),
			body: toI18nText(body),
			is_required: required,
			published_at: toTimestamp(publishedAt),
		};

		// 저장한 버전을 고름
		const handleSaved = (savedConsent: Consent) => {
			onClose();

			router.push(
				`/consents?${new URLSearchParams({ kind: savedConsent.kind, version: String(savedConsent.version) })}`,
				{ scroll: false },
			);
		};

		if (formMode === 'edit' && sourceConsent) {
			updateConsent.mutate(
				{ id: sourceConsent.id, data: consentRequest },
				{ onSuccess: handleSaved, onError: () => setConfirmDialogOpen(false) },
			);

			return;
		}

		createConsent.mutate(
			{ data: { ...consentRequest, kind: sourceConsent?.kind ?? kind } },
			{ onSuccess: handleSaved, onError: () => setConfirmDialogOpen(false) },
		);
	};

	const confirmText =
		formMode === 'edit' && sourceConsent
			? {
					title: '이 버전을 수정할까요?',
					message: `${koreanOrEnglishText(sourceConsent.title)} 버전 ${sourceConsent.version}`,
					confirm: '저장',
				}
			: { title: formMode === 'newVersion' ? '새 버전을 저장할까요?' : '고지문을 저장할까요?', confirm: '저장' };

	return (
		<form className="grid gap-3" onSubmit={handleSubmit}>
			{formMode === 'newConsent' ? (
				<div className={rowClassName}>
					<label htmlFor={kindInputId} className={labelClassName}>
						종류
					</label>

					<div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
						<Input
							id={kindInputId}
							required
							autoComplete="off"
							placeholder="location_usage"
							maxLength={CONSENT_KIND_MAX_LENGTH}
							value={kind}
							className="w-60 tabular-nums max-md:w-full"
							onChange={(event) => setKind(event.target.value)}
						/>
						<p className="text-[12.5px] text-muted-foreground">
							같은 종류의 고지문은 버전으로 묶이며 저장한 뒤에는 종류를 변경할 수 없습니다.
						</p>
					</div>
				</div>
			) : (
				<div className="mb-0.5 flex min-h-7 flex-wrap items-center justify-between gap-x-3 gap-y-2">
					<h3 className="text-base font-bold">
						{formMode === 'edit' ? `버전 ${sourceConsent?.version} 수정` : '새 버전'}
					</h3>

					{formMode === 'newVersion' && (
						<p className="text-[13px] text-muted-foreground">
							버전 {sourceConsent?.version}의 내용에서 시작
						</p>
					)}
				</div>
			)}

			{/*언어마다 제목 및 본문을 한 상자에 입력*/}
			<div className={`${rowClassName} md:items-start`}>
				<span className={`${labelClassName} md:pt-2`}>내용</span>

				<div className="grid gap-3 md:grid-cols-2">
					<LocaleTextField
						locale="ko_kr"
						title={title.ko_kr}
						body={body.ko_kr}
						bodyClassName={bodyClassName}
						englishBodyRequired
						lengthText={`${title.ko_kr.length}/${TITLE_MAX_LENGTH}`}
						onTitleChange={(ko_kr) => setTitle((prev) => ({ ...prev, ko_kr }))}
						onBodyChange={(ko_kr) => setBody((prev) => ({ ...prev, ko_kr }))}
					/>
					<LocaleTextField
						locale="en_us"
						title={title.en_us}
						body={body.en_us}
						bodyClassName={bodyClassName}
						englishBodyRequired
						lengthText={`${title.en_us.length}/${TITLE_MAX_LENGTH}`}
						onTitleChange={(en_us) => setTitle((prev) => ({ ...prev, en_us }))}
						onBodyChange={(en_us) => setBody((prev) => ({ ...prev, en_us }))}
					/>
				</div>
			</div>

			<div className={rowClassName}>
				<span className={labelClassName}>동의</span>

				<SegmentedControl
					label="동의"
					options={[
						{ value: true, label: '필수' },
						{ value: false, label: '선택' },
					]}
					value={required}
					onValueChange={setRequired}
				/>
			</div>

			<div className={rowClassName}>
				<label htmlFor={publishedAtInputId} className={labelClassName}>
					게시 일시
				</label>

				<DateTimePicker
					id={publishedAtInputId}
					value={publishedAt}
					ariaLabel="게시 일시"
					required
					className="w-60 max-md:w-full"
					onValueChange={setPublishedAt}
				/>
			</div>

			<p className="flex items-start gap-2 rounded-lg bg-warning/10 px-3 py-2.5 text-[13px] md:ml-21">
				<TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
				{/*좁은 화면에서는 문장마다 줄바꿈*/}
				<span>
					<span className="max-md:block">{toPublishNotice(required, liveConsentExists)}</span>{' '}
					<span className="max-md:block">게시된 뒤에는 수정하거나 삭제할 수 없습니다.</span>
				</span>
			</p>

			<div className="flex justify-end gap-2 pt-1">
				<Button type="button" variant="outline" disabled={saving} className="max-md:flex-1" onClick={onClose}>
					취소
				</Button>
				<Button type="submit" loading={saving} className="max-md:flex-1">
					저장
				</Button>
			</div>

			<ConfirmDialog
				open={confirmDialogOpen}
				text={confirmText}
				confirmVariant="default"
				busy={saving}
				onConfirm={handleSave}
				onClose={() => setConfirmDialogOpen(false)}
			/>
		</form>
	);
};

export default ConsentForm;
