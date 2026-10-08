'use client';

import useAudioPlayer from '@/hooks/use-audio-player';

import { Play, Square } from 'lucide-react';

import { formatAudioDuration } from '@/utils/audio';

interface Props {
	audioUrl: string;
	name: string;
}

/**
 * 프리셋 음성을 재생하는 컴포넌트
 * @param audioUrl 음성 파일 주소
 * @param name 음성의 이름
 */
const PresetWordAudioPlayer = ({ audioUrl, name }: Props) => {
	const { playing, progressPercent, durationSeconds, handleTogglePlay, audioProps } = useAudioPlayer();

	return (
		<div className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg bg-muted py-2.5 pr-3.5 pl-2.5">
			<audio src={audioUrl} preload="metadata" {...audioProps}>
				<track kind="captions" />
			</audio>

			<button
				type="button"
				aria-label={`${name} ${playing ? '정지' : '재생'}`}
				className="grid size-7 place-items-center rounded-full bg-foreground text-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
				onClick={handleTogglePlay}
			>
				{playing ? <Square className="size-3 fill-current" /> : <Play className="size-3.5 fill-current" />}
			</button>

			<span aria-hidden className="h-1 overflow-hidden rounded-full bg-chart-neutral">
				<span
					className="block h-full rounded-full bg-chart-1"
					style={{ width: `${playing ? progressPercent : 0}%` }}
				/>
			</span>

			{durationSeconds !== null && (
				<time className="text-[13px] text-muted-foreground tabular-nums">
					{formatAudioDuration(durationSeconds)}
				</time>
			)}
		</div>
	);
};

export default PresetWordAudioPlayer;
