'use client';

import { type SubmitEvent, useId, useState } from 'react';

import type { SessionSoundDetail, SessionSoundLabelTarget } from '@/types/apis/sessions';

import { useCancelSessionSoundLabel, useUpdateSessionSoundLabel } from '@/hooks/apis/sessions';

import { readBrowserOperatorName } from '@/lib/auth';
import { cn } from '@/lib/utils';

import { Check, X } from 'lucide-react';

import TitledBox from '@/app/(main)/(backoffice)/_components/titled-box';
import SessionSoundScore from '@/app/(main)/(backoffice)/users/[id]/_components/session-sound-score';
import { LABEL_MEMO_MAX_LENGTH } from '@/config';
import { SESSION_SOUND_LABEL_TARGETS } from '@/config/session';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const fieldLabelClassName = 'text-[13px] font-semibold text-muted-foreground';

interface Props {
	sessionId: string;
	soundId: string;
	target: SessionSoundLabelTarget;
	finalScore: number | null;
	latestLabel?: SessionSoundDetail['labels'][number];
}

/**
 * 소리 라벨 입력 폼 컴포넌트
 * @param sessionId 소리가 속한 세션 ID
 * @param soundId 라벨을 저장할 소리 ID
 * @param target 라벨 대상
 * @param finalScore 라벨 및 모델 결과로 정한 최종 점수
 * @param latestLabel 대상의 최근 라벨
 */
const SessionSoundLabelForm = ({ sessionId, soundId, target, finalScore, latestLabel }: Props) => {
	const scoreInputId = useId();
	const memoInputId = useId();

	// 취소하지 않은 최근 라벨의 값으로 시작
	const activeLabel = latestLabel?.is_positive === null ? undefined : latestLabel;

	const [positive, setPositive] = useState(activeLabel?.is_positive ?? undefined);
	const [scorePercent, setScorePercent] = useState(
		activeLabel?.score === null || activeLabel?.score === undefined
			? ''
			: String(Math.round(activeLabel.score * 100)),
	);
	const [memo, setMemo] = useState('');

	const updateLabel = useUpdateSessionSoundLabel();
	const cancelLabel = useCancelSessionSoundLabel();

	const targetName = SESSION_SOUND_LABEL_TARGETS[target];
	const saving = updateLabel.isPending || cancelLabel.isPending;

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (saving || positive === undefined) {
			return;
		}

		// 0~100 정수를 서버의 0~1 점수로 변환
		updateLabel.mutate(
			{
				id: sessionId,
				soundId,
				target,
				data: {
					is_positive: positive,
					score: Number(scorePercent) / 100,
					memo: memo.trim() || null,
					operator_name: readBrowserOperatorName(),
				},
			},
			{ onSuccess: () => setMemo('') },
		);
	};

	const handleCancel = () => {
		if (saving) {
			return;
		}

		cancelLabel.mutate(
			{
				id: sessionId,
				soundId,
				target,
				data: { memo: memo.trim() || null, operator_name: readBrowserOperatorName() },
			},
			{ onSuccess: () => setMemo('') },
		);
	};

	return (
		<TitledBox
			title={targetName}
			action={
				<span className="text-[12.5px] text-muted-foreground">
					<SessionSoundScore
						label="최종"
						score={finalScore}
						barClassName={target === 'parrot' ? 'bg-foreground' : 'bg-chart-1'}
					/>
				</span>
			}
		>
			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-2.5 p-3">
					<span className={fieldLabelClassName}>판정</span>
					<fieldset className="grid grid-cols-2 gap-2">
						<legend className="sr-only">{targetName} 여부</legend>

						<Button
							type="button"
							variant="outline"
							aria-pressed={positive === true}
							className="aria-pressed:border-success aria-pressed:bg-success/10 aria-pressed:text-success"
							onClick={() => setPositive(true)}
						>
							<Check />예
						</Button>
						<Button
							type="button"
							variant="outline"
							aria-pressed={positive === false}
							className="aria-pressed:border-destructive aria-pressed:bg-destructive/10 aria-pressed:text-destructive"
							onClick={() => setPositive(false)}
						>
							<X />
							아니오
						</Button>
					</fieldset>

					<label htmlFor={scoreInputId} className={fieldLabelClassName}>
						점수
					</label>
					<div className="flex items-center gap-1.5">
						<Input
							id={scoreInputId}
							type="number"
							inputMode="numeric"
							required
							min={0}
							max={100}
							step={1}
							value={scorePercent}
							className="w-16 text-right tabular-nums"
							onChange={(event) => setScorePercent(event.target.value)}
						/>
						<span className="text-muted-foreground">%</span>
					</div>

					<label htmlFor={memoInputId} className={cn(fieldLabelClassName, 'self-start pt-2')}>
						메모
					</label>
					<Textarea
						id={memoInputId}
						placeholder="메모"
						maxLength={LABEL_MEMO_MAX_LENGTH}
						value={memo}
						className="min-h-14"
						onChange={(event) => setMemo(event.target.value)}
					/>
				</div>

				<div className="flex justify-end gap-1.5 border-t px-3 py-2.5">
					{!!activeLabel && (
						<Button
							type="button"
							variant="destructive"
							loading={cancelLabel.isPending}
							disabled={saving}
							onClick={handleCancel}
						>
							취소
						</Button>
					)}
					<Button type="submit" loading={updateLabel.isPending} disabled={positive === undefined || saving}>
						저장
					</Button>
				</div>
			</form>
		</TitledBox>
	);
};

export default SessionSoundLabelForm;
