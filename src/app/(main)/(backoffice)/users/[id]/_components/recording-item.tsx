'use client';

import { type SyntheticEvent, useRef, useState } from 'react';

import { Play, Square } from 'lucide-react';

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
	const audioRef = useRef<HTMLAudioElement>(null);

	const [playing, setPlaying] = useState(false);
	const [progressPercent, setProgressPercent] = useState(0);
	const [durationSeconds, setDurationSeconds] = useState<number | null>(null);

	const handleTogglePlay = () => {
		const audio = audioRef.current;

		if (!audio) {
			return;
		}

		if (!playing) {
			void audio.play();

			return;
		}

		audio.pause();
		audio.currentTime = 0;
	};

	const handleTimeUpdate = (event: SyntheticEvent<HTMLAudioElement>) => {
		const { currentTime, duration } = event.currentTarget;

		setProgressPercent(Number.isFinite(duration) ? (currentTime / duration) * 100 : 0);
	};

	return (
		<li className="flex items-center gap-2.5 py-1 text-[13px]">
			<audio
				ref={audioRef}
				src={audioUrl}
				preload="metadata"
				onLoadedMetadata={(event) => setDurationSeconds(event.currentTarget.duration)}
				onTimeUpdate={handleTimeUpdate}
				onPlay={() => setPlaying(true)}
				onPause={() => setPlaying(false)}
			>
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

			{durationSeconds !== null && Number.isFinite(durationSeconds) && (
				<time className="text-muted-foreground tabular-nums">
					{Math.floor(durationSeconds / 60)}:{String(Math.round(durationSeconds % 60)).padStart(2, '0')}
				</time>
			)}
		</li>
	);
};

export default RecordingItem;
