'use client';

import { type SubmitEvent, useId, useState } from 'react';

import type { SessionSoundDetail, SessionSoundLabelTarget } from '@/types/apis/sessions';

import { useCancelSessionSoundLabel, useUpdateSessionSoundLabel } from '@/hooks/apis/sessions';

import { readBrowserOperatorName } from '@/lib/auth';

import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';
import TitledBox from '@/app/(main)/(backoffice)/_components/titled-box';
import SessionSoundScore from '@/app/(main)/(backoffice)/users/[id]/_components/session-sound-score';
import { LABEL_MEMO_MAX_LENGTH } from '@/config';
import { SESSION_SOUND_LABEL_TARGETS } from '@/config/session';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const positiveOptions = [
	{ value: true, label: '예' },
	{ value: false, label: '아니오' },
];

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
						barClassName={target === 'parrot' ? 'bg-chart-1' : 'bg-foreground'}
					/>
				</span>
			}
		>
			<form onSubmit={handleSubmit} className="grid gap-2.5 p-3">
				<div className="flex flex-wrap items-center gap-x-3 gap-y-2">
					<SegmentedControl
						label={`${targetName} 여부`}
						options={positiveOptions}
						value={positive}
						className="divide-x"
						onValueChange={setPositive}
					/>

					<div className="flex items-center gap-1.5">
						<label htmlFor={scoreInputId} className="text-[13px] font-semibold text-muted-foreground">
							점수
						</label>
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
				</div>

				<Textarea
					aria-label={`${targetName} 메모`}
					placeholder="메모"
					maxLength={LABEL_MEMO_MAX_LENGTH}
					value={memo}
					className="min-h-14"
					onChange={(event) => setMemo(event.target.value)}
				/>

				<div className="flex justify-end gap-1.5">
					{!!activeLabel && (
						<Button
							type="button"
							variant="destructive"
							loading={cancelLabel.isPending}
							disabled={saving}
							onClick={handleCancel}
						>
							라벨 취소
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
