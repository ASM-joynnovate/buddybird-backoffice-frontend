'use client';

import { useState } from 'react';

import { useCancelSessionEventLabel, useGetSessionEvent, useUpdateSessionEventLabel } from '@/hooks/apis/sessions';

import { readBrowserOperatorName } from '@/lib/auth';

import { CircleCheck, CircleX } from 'lucide-react';

import CorrectnessIcon from '@/app/(main)/(backoffice)/_components/correctness-icon';
import TitledBox from '@/app/(main)/(backoffice)/_components/titled-box';
import LabelHistory from '@/app/(main)/(backoffice)/users/[id]/_components/label-history';
import UserReviewBox from '@/app/(main)/(backoffice)/users/[id]/_components/user-review-box';
import { LABEL_MEMO_MAX_LENGTH } from '@/config';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Props {
	sessionId: string;
	eventId: string;
}

/**
 * 세션 이벤트 라벨 입력 컴포넌트
 * @param sessionId 이벤트가 속한 세션 ID
 * @param eventId 라벨을 저장할 이벤트 ID
 */
const SessionEventLabelContent = ({ sessionId, eventId }: Props) => {
	const { data: sessionEventData } = useGetSessionEvent({ id: sessionId, eventId });

	const [memo, setMemo] = useState('');

	const updateLabel = useUpdateSessionEventLabel();
	const cancelLabel = useCancelSessionEventLabel();

	const { is_correct: isCorrect } = sessionEventData;
	const saving = updateLabel.isPending || cancelLabel.isPending;

	const handleSave = (nextCorrect: boolean) => {
		if (saving) {
			return;
		}

		updateLabel.mutate(
			{
				id: sessionId,
				eventId,
				data: { is_correct: nextCorrect, memo: memo.trim() || null, operator_name: readBrowserOperatorName() },
			},
			{ onSuccess: () => setMemo('') },
		);
	};

	const handleCancel = () => {
		if (saving) {
			return;
		}

		cancelLabel.mutate(
			{ id: sessionId, eventId, data: { memo: memo.trim() || null, operator_name: readBrowserOperatorName() } },
			{ onSuccess: () => setMemo('') },
		);
	};

	return (
		<>
			<UserReviewBox userReview={sessionEventData.user_review} />

			<TitledBox
				title="라벨"
				action={
					isCorrect !== null && <CorrectnessIcon correct={isCorrect} label={isCorrect ? '맞음' : '틀림'} />
				}
			>
				<div className="grid gap-2.5 p-3">
					<Textarea
						aria-label="메모"
						placeholder="메모"
						maxLength={LABEL_MEMO_MAX_LENGTH}
						value={memo}
						className="min-h-14"
						onChange={(event) => setMemo(event.target.value)}
					/>

					<div className="flex gap-1.5">
						<Button
							variant="outline"
							size="sm"
							aria-pressed={isCorrect === true}
							loading={updateLabel.isPending && updateLabel.variables?.data.is_correct === true}
							disabled={saving}
							className="aria-pressed:border-success aria-pressed:bg-success/10 aria-pressed:text-success"
							onClick={() => handleSave(true)}
						>
							<CircleCheck />
							맞음
						</Button>
						<Button
							variant="outline"
							size="sm"
							aria-pressed={isCorrect === false}
							loading={updateLabel.isPending && updateLabel.variables?.data.is_correct === false}
							disabled={saving}
							className="aria-pressed:border-destructive aria-pressed:bg-destructive/10 aria-pressed:text-destructive"
							onClick={() => handleSave(false)}
						>
							<CircleX />
							틀림
						</Button>

						{isCorrect !== null && (
							<Button
								variant="destructive"
								size="sm"
								loading={cancelLabel.isPending}
								disabled={saving}
								className="ml-auto"
								onClick={handleCancel}
							>
								라벨 취소
							</Button>
						)}
					</div>
				</div>
			</TitledBox>

			<TitledBox
				title="수정 기록"
				action={
					<span className="text-[12.5px] text-muted-foreground tabular-nums">
						{sessionEventData.labels.length}건
					</span>
				}
			>
				<LabelHistory
					labels={sessionEventData.labels.map((label) => ({
						id: label.id,
						positive: label.is_correct,
						result: label.is_correct === null ? '라벨 취소' : label.is_correct ? '맞음' : '틀림',
						operatorName: label.operator_name,
						memo: label.memo,
						createdAt: label.created_at,
					}))}
					className="max-h-50"
				/>
			</TitledBox>
		</>
	);
};

export default SessionEventLabelContent;
