'use client';

import type { SessionSound } from '@/types/apis/sessions';

import { createPortal } from 'react-dom';

import { formatShortDateTimeWithSeconds, formatTimeWithSeconds } from '@/utils/date';

export interface ScoreTooltip {
	title?: string;
	sounds: SessionSound[];
	left: number;
	top: number;
}

interface Props {
	scoreTooltip: ScoreTooltip;
	judging: boolean;
}

/**
 * 가리킨 소리의 점수 툴팁 컴포넌트
 * @param scoreTooltip 표시할 소리 및 화면 위치
 * @param judging 모사 판정이 끝나지 않았는지 여부
 */
const SessionScoreTooltip = ({ scoreTooltip, judging }: Props) => {
	const { title, sounds, left, top } = scoreTooltip;

	const analysisScores = sounds.flatMap((sound) => (sound.analysis ? [sound.analysis.score] : []));
	const judgmentScores = sounds.flatMap((sound) => (sound.judgment ? [sound.judgment.score] : []));
	const averageAnalysisScore = analysisScores.reduce((total, score) => total + score, 0) / analysisScores.length;
	const multiple = sounds.length > 1;

	const firstSound = sounds.at(0);
	const lastSound = sounds.at(-1);

	if (!firstSound || !lastSound) {
		return null;
	}

	// 타임라인이 스크롤되어도 가려지지 않도록 body에 표시
	return createPortal(
		<div
			role="tooltip"
			className="pointer-events-none fixed z-50 grid -translate-x-1/2 -translate-y-[calc(100%+12px)] animate-in gap-1 rounded-lg bg-tooltip px-3 py-2 text-xs whitespace-nowrap text-tooltip-foreground shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)] duration-120 fade-in-0"
			style={{ left, top }}
		>
			{!!title && <strong className="text-[13px] font-bold">{title}</strong>}

			<div className="flex items-center gap-1.5">
				<span className="size-2 rounded-full bg-chart-1" />
				<strong className="text-[13px] font-bold tabular-nums">
					{analysisScores.length > 0 ? `${Math.round(averageAnalysisScore * 100)}%` : '-'}
				</strong>
				<span className="text-tooltip-foreground/75">{multiple ? '앵무새 소리 평균' : '앵무새 소리'}</span>
			</div>

			<div className="flex items-center gap-1.5">
				<span className="size-2 rounded-full bg-tooltip-foreground" />
				<strong className="text-[13px] font-bold tabular-nums">
					{judgmentScores.length > 0 && `${Math.round(Math.max(...judgmentScores) * 100)}%`}
					{judgmentScores.length === 0 && (judging ? '판정 중' : '-')}
				</strong>
				<span className="text-tooltip-foreground/75">{multiple ? '모사 최고' : '모사'}</span>
			</div>

			<time className="text-tooltip-foreground/75 tabular-nums">
				{formatShortDateTimeWithSeconds(firstSound.captured_at)}
				{multiple && ` ~ ${formatTimeWithSeconds(lastSound.captured_at)}`}
			</time>
		</div>,
		document.body,
	);
};

export default SessionScoreTooltip;
