'use client';

import type { SessionSound } from '@/types/apis/sessions';

import { useGetSessionSound, useRequestSessionSoundMimicJudgment } from '@/hooks/apis/sessions';
import type { AudioPlaylist } from '@/hooks/use-audio-playlist';

import { cn } from '@/lib/utils';

import { Play, Square } from 'lucide-react';

import ColorTag from '@/app/(main)/(backoffice)/_components/color-tag';
import CorrectnessIcon from '@/app/(main)/(backoffice)/_components/correctness-icon';
import SoundDownloadButton from '@/app/(main)/(backoffice)/_components/sound-download-button';
import TitledBox from '@/app/(main)/(backoffice)/_components/titled-box';
import LabelHistory from '@/app/(main)/(backoffice)/users/[id]/_components/label-history';
import SessionSoundLabelForm from '@/app/(main)/(backoffice)/users/[id]/_components/session-sound-label-form';
import UserReviewBox from '@/app/(main)/(backoffice)/users/[id]/_components/user-review-box';
import { SESSION_SOUND_KINDS, SESSION_SOUND_LABEL_TARGETS } from '@/config/session';
import { SECOND } from '@/config/units';
import { formatAudioDuration } from '@/utils/audio';
import { formatCompactDateTime, formatShortDateTime, formatShortDateTimeWithSeconds } from '@/utils/date';

import { Button } from '@/components/ui/button';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const subtitleClassName = 'px-3 pt-2.5 text-[12.5px] font-semibold text-muted-foreground';
const scrollAreaClassName = '[scrollbar-width:thin] overflow-auto overscroll-contain';
const headClassName = 'sticky -top-px h-8 bg-card px-1.5 text-[12.5px] first:pl-3 last:pr-3';
const cellClassName = 'px-1.5 py-1.5 tabular-nums first:pl-3 last:pr-3';

interface Props {
	sessionId: string;
	sound: SessionSound;
	player: AudioPlaylist;
}

/**
 * 선택한 소리의 상세 컴포넌트
 * @param sessionId 소리가 속한 세션 ID
 * @param sound 선택한 소리
 * @param player useAudioPlaylist 결과
 */
const SessionSoundDetail = ({ sessionId, sound, player }: Props) => {
	const { data: sessionSoundData } = useGetSessionSound({ id: sessionId, soundId: sound.id });

	const requestMimicJudgment = useRequestSessionSoundMimicJudgment();

	const { kind, parrot_detections: parrotDetections, mimic_judgments: mimicJudgments } = sessionSoundData;
	const soundTime = formatShortDateTimeWithSeconds(sound.captured_at);
	const soundPlaying = player.playing && player.currentSoundId === sound.id;
	// 앵무새 소리로 판별된 소리만 모사 판정 가능
	const mimicJudgable = kind === 'parrot' || kind === 'mimic';

	const handleRequestMimicJudgment = () => {
		if (requestMimicJudgment.isPending) {
			return;
		}

		requestMimicJudgment.mutate({ id: sessionId, soundId: sound.id });
	};

	return (
		<>
			<div className="grid min-w-0 gap-2.5 rounded-lg border bg-card p-3">
				<div className="flex items-center gap-2.5">
					<button
						type="button"
						aria-label={`${soundTime} 소리 ${soundPlaying ? '정지' : '재생'}`}
						className="grid size-8 shrink-0 place-items-center rounded-full bg-foreground text-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
						onClick={player.handleTogglePlay}
					>
						{soundPlaying ? (
							<Square className="size-3 fill-current" />
						) : (
							<Play className="size-3.5 fill-current" />
						)}
					</button>

					<div className="mr-auto min-w-0">
						<strong className="block font-bold tabular-nums">{soundTime}</strong>
						{!!sound.duration_ms && (
							<span className="text-[12.5px] text-muted-foreground tabular-nums">
								{formatAudioDuration(sound.duration_ms / SECOND)}
							</span>
						)}
					</div>

					<SoundDownloadButton
						sounds={[sound]}
						fileName={`sound-${formatCompactDateTime(sound.captured_at)}.wav`}
						label={`${soundTime} 소리 다운로드`}
						iconOnly
					/>
				</div>

				<dl className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-x-3 border-t pt-2.5 text-[13px]">
					<dt className="text-muted-foreground">최종 결과</dt>
					<dd>
						{kind ? (
							<ColorTag color={SESSION_SOUND_KINDS[kind].color}>
								{SESSION_SOUND_KINDS[kind].label}
							</ColorTag>
						) : (
							<span className="text-muted-foreground">-</span>
						)}
					</dd>
				</dl>
			</div>

			<UserReviewBox userReview={sessionSoundData.user_review} />

			<SessionSoundLabelForm
				sessionId={sessionId}
				soundId={sound.id}
				target="parrot"
				finalScore={sessionSoundData.final_parrot_score}
				latestLabel={sessionSoundData.labels.findLast((label) => label.target === 'parrot')}
			/>
			<SessionSoundLabelForm
				sessionId={sessionId}
				soundId={sound.id}
				target="mimic"
				finalScore={sessionSoundData.final_mimic_score}
				latestLabel={sessionSoundData.labels.findLast((label) => label.target === 'mimic')}
			/>

			<TitledBox
				title="모델 결과"
				action={
					<Button
						variant="outline"
						size="sm"
						loading={requestMimicJudgment.isPending}
						disabled={!mimicJudgable}
						onClick={handleRequestMimicJudgment}
					>
						모델 재판정
					</Button>
				}
			>
				<p className={subtitleClassName}>앵무새 소리 판별</p>
				<div className={cn(scrollAreaClassName, 'max-h-38')}>
					<table className="w-max min-w-full text-[13px]">
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className={cn(headClassName, 'min-w-24')}>시각</TableHead>
								<TableHead className={cn(headClassName, 'min-w-20')}>모델</TableHead>
								<TableHead className={cn(headClassName, 'min-w-5')} />
								<TableHead className={cn(headClassName, 'min-w-10')}>점수</TableHead>
								<TableHead className={cn(headClassName, 'min-w-9')}>울음</TableHead>
								<TableHead className={cn(headClassName, 'min-w-9')}>짹짹</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{parrotDetections.map((parrotDetection) => (
								<TableRow key={parrotDetection.analyzed_at} className="hover:bg-transparent">
									<TableCell className={cellClassName}>
										{formatShortDateTime(parrotDetection.analyzed_at)}
									</TableCell>
									<TableCell className={cn(cellClassName, 'text-muted-foreground')}>
										{parrotDetection.model_version}
									</TableCell>
									<TableCell className={cellClassName}>
										<CorrectnessIcon
											correct={parrotDetection.is_parrot}
											label={parrotDetection.is_parrot ? '앵무새 소리' : '앵무새 소리 아님'}
											className="size-3.5"
										/>
									</TableCell>
									<TableCell className={cellClassName}>
										{Math.round(parrotDetection.score * 100)}%
									</TableCell>
									<TableCell className={cellClassName}>{parrotDetection.call_count}</TableCell>
									<TableCell className={cellClassName}>{parrotDetection.chirp_count}</TableCell>
								</TableRow>
							))}
							{parrotDetections.length === 0 && (
								<TableRow className="hover:bg-transparent">
									<TableCell colSpan={6} className={cn(cellClassName, 'text-muted-foreground')}>
										결과 없음
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</table>
				</div>

				<p className={cn(subtitleClassName, 'border-t')}>모사 판정</p>
				<div className={cn(scrollAreaClassName, 'max-h-30 pb-1.5')}>
					<table className="w-max min-w-full text-[13px]">
						<TableHeader>
							<TableRow className="hover:bg-transparent">
								<TableHead className={cn(headClassName, 'min-w-24')}>시각</TableHead>
								<TableHead className={cn(headClassName, 'min-w-20')}>모델</TableHead>
								<TableHead className={cn(headClassName, 'min-w-5')} />
								<TableHead className={cn(headClassName, 'min-w-10')}>점수</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{mimicJudgments.map((mimicJudgment) => (
								<TableRow key={mimicJudgment.judged_at} className="hover:bg-transparent">
									<TableCell className={cellClassName}>
										{formatShortDateTime(mimicJudgment.judged_at)}
									</TableCell>
									<TableCell className={cn(cellClassName, 'text-muted-foreground')}>
										{mimicJudgment.model_version}
									</TableCell>
									<TableCell className={cellClassName}>
										{/*단어가 일치하면 모사로 판정*/}
										<CorrectnessIcon
											correct={mimicJudgment.word_id !== null}
											label={mimicJudgment.word_id === null ? '모사 아님' : '모사'}
											className="size-3.5"
										/>
									</TableCell>
									<TableCell className={cellClassName}>
										{Math.round(mimicJudgment.score * 100)}%
									</TableCell>
								</TableRow>
							))}
							{mimicJudgments.length === 0 && (
								<TableRow className="hover:bg-transparent">
									<TableCell colSpan={4} className={cn(cellClassName, 'text-muted-foreground')}>
										결과 없음
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</table>
				</div>
			</TitledBox>

			<TitledBox
				title="수정 기록"
				action={
					<span className="text-[12.5px] text-muted-foreground tabular-nums">
						{sessionSoundData.labels.length}건
					</span>
				}
			>
				<LabelHistory
					labels={sessionSoundData.labels.map((label) => ({
						id: label.id,
						target: SESSION_SOUND_LABEL_TARGETS[label.target],
						positive: label.is_positive,
						result: label.is_positive === null ? '라벨 취소' : label.is_positive ? '예' : '아니오',
						score: label.score,
						operatorName: label.operator_name,
						memo: label.memo,
						createdAt: label.created_at,
					}))}
					className="max-h-59"
				/>
			</TitledBox>
		</>
	);
};

export default SessionSoundDetail;
