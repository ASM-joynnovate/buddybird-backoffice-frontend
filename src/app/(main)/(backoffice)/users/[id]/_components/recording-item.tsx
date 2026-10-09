'use client';

import useAudioPlayer from '@/hooks/use-audio-player';

import { Play, Square } from 'lucide-react';

import { formatAudioDuration } from '@/utils/audio';

interface Props {
	audioUrl: string;
	label: string;
	wordName: string;
}

/**
 * 녹음 하나를 재생하는 컴포넌트
 * @param audioUrl 녹음 파일 주소
 * @param label 녹음의 이름
 * @param wordName 녹음이 속한 단어
 */
const RecordingItem = ({ audioUrl, label, wordName }: Props) => {
	const { playing, progressPercent, durationSeconds, handleTogglePlay, audioProps } = useAudioPlayer();

	return (
		<li className="flex items-center gap-2.5 py-1 text-[13px]">
			<audio src={audioUrl} preload="metadata" {...audioProps}>
				<track kind="captions" />
			</audio>

			<button
				type="button"
				aria-label={`${wordName} ${label} ${playing ? '정지' : '재생'}`}
				className="grid size-7 shrink-0 place-items-center rounded-full bg-foreground text-card"
				onClick={handleTogglePlay}
			>
				{playing ? <Square className="size-3 fill-current" /> : <Play className="size-3.5 fill-current" />}
			</button>

			<span className="whitespace-nowrap text-muted-foreground">{label}</span>

			<span aria-hidden className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
				<span className="block h-full rounded-full bg-chart-1" style={{ width: `${progressPercent}%` }} />
			</span>

			{durationSeconds !== null && (
				<time className="text-muted-foreground tabular-nums">{formatAudioDuration(durationSeconds)}</time>
			)}
		</li>
	);
};

export default RecordingItem;
