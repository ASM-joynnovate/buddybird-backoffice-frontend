'use client';

import { type SubmitEvent, useId, useState } from 'react';

import type { SessionSoundDetail, SessionSoundLabelTarget } from '@/types/apis/sessions';

import { useCancelSessionSoundLabel, useUpdateSessionSoundLabel } from '@/hooks/apis/sessions';

import { readBrowserOperatorName } from '@/lib/auth';
import { cn } from '@/lib/utils';

import { Check, X } from 'lucide-react';

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
	latestLabel?: SessionSoundDetail['labels'][number];
	latestModelResult?: { positive: boolean; score: number };
}

/**
 * 소리 라벨 입력 폼 컴포넌트
 * @param sessionId 소리가 속한 세션 ID
 * @param soundId 라벨을 저장할 소리 ID
 * @param target 라벨 대상
 * @param latestLabel 대상의 최근 라벨
 * @param latestModelResult 대상의 최근 모델 결과
 */
const SessionSoundLabelForm = ({ sessionId, soundId, target, latestLabel, latestModelResult }: Props) => {
	const scoreInputId = useId();
	const memoInputId = useId();

	// 취소하지 않은 라벨이 없으면 모델 결과로 시작
	const activeLabel = latestLabel?.is_positive === null ? undefined : latestLabel;
	const initialPositive = activeLabel ? (activeLabel.is_positive ?? undefined) : latestModelResult?.positive;
	const initialScore = activeLabel ? activeLabel.score : latestModelResult?.score;
	const initialScorePercent =
		initialScore === null || initialScore === undefined ? '' : String(Math.round(initialScore * 100));

	const [positive, setPositive] = useState(initialPositive);
	const [scorePercent, setScorePercent] = useState(initialScorePercent);
	const [memo, setMemo] = useState('');

	const updateLabel = useUpdateSessionSoundLabel();
	const cancelLabel = useCancelSessionSoundLabel();

	const targetName = SESSION_SOUND_LABEL_TARGETS[target];
	const saving = updateLabel.isPending || cancelLabel.isPending;
	const inputChanged = positive !== initialPositive || scorePercent !== initialScorePercent || memo !== '';

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (saving || positive === undefined) {
			return;
		}

		// 0~100 정수를 서버의 0~1 점수로 변환
		updateLabel.mutate({
			id: sessionId,
			soundId,
			target,
			data: {
				is_positive: positive,
				score: Number(scorePercent) / 100,
				memo: memo.trim() || null,
				operator_name: readBrowserOperatorName(),
			},
		});
	};

	const handleCancelLabel = () => {
		if (saving) {
			return;
		}

		cancelLabel.mutate({
			id: sessionId,
			soundId,
			target,
			data: { memo: memo.trim() || null, operator_name: readBrowserOperatorName() },
		});
	};

	const handleResetInput = () => {
		setPositive(initialPositive);
		setScorePercent(initialScorePercent);
		setMemo('');
	};

	return (
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
						className="mr-auto"
						onClick={handleCancelLabel}
					>
						삭제
					</Button>
				)}
				<Button
					type="button"
					variant="destructive"
					disabled={!inputChanged || saving}
					onClick={handleResetInput}
				>
					취소
				</Button>
				<Button
					type="submit"
					loading={updateLabel.isPending}
					disabled={positive === undefined || (!!activeLabel && !inputChanged) || saving}
				>
					저장
				</Button>
			</div>
		</form>
	);
};

export default SessionSoundLabelForm;
