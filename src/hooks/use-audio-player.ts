import { type SyntheticEvent, useEffect, useRef, useState } from 'react';

let playingAudio: HTMLAudioElement | null = null;

/** 음성 재생 Hook */
const useAudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);

	const [playing, setPlaying] = useState(false);
	const [progressPercent, setProgressPercent] = useState(0);
	const [durationSeconds, setDurationSeconds] = useState<number | null>(null);

	/** hydration 전에 읽은 음성 길이 반영 */
	useEffect(() => {
		const audio = audioRef.current;

		if (audio && Number.isFinite(audio.duration)) {
			setDurationSeconds(audio.duration);
		}
	}, []);

	/** 재생 중 매 프레임 진행 비율 갱신 */
	useEffect(() => {
		if (!playing) {
			return;
		}

		let frame = requestAnimationFrame(function updateProgress() {
			const audio = audioRef.current;

			if (audio && Number.isFinite(audio.duration)) {
				setProgressPercent((audio.currentTime / audio.duration) * 100);
			}

			frame = requestAnimationFrame(updateProgress);
		});

		return () => cancelAnimationFrame(frame);
	}, [playing]);

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

	const handleLoadedMetadata = (event: SyntheticEvent<HTMLAudioElement>) => {
		const { duration } = event.currentTarget;

		setDurationSeconds(Number.isFinite(duration) ? duration : null);
	};

	const handleTimeUpdate = (event: SyntheticEvent<HTMLAudioElement>) => {
		const { currentTime, duration } = event.currentTarget;

		setProgressPercent(Number.isFinite(duration) ? (currentTime / duration) * 100 : 0);
	};

	const handlePlay = (event: SyntheticEvent<HTMLAudioElement>) => {
		// 재생 중인 다른 음성 정지
		if (playingAudio && playingAudio !== event.currentTarget) {
			playingAudio.pause();
			playingAudio.currentTime = 0;
		}

		playingAudio = event.currentTarget;

		setPlaying(true);
	};

	return {
		playing,
		progressPercent,
		durationSeconds,
		handleTogglePlay,
		audioProps: {
			ref: audioRef,
			onLoadedMetadata: handleLoadedMetadata,
			onTimeUpdate: handleTimeUpdate,
			onPlay: handlePlay,
			onPause: () => setPlaying(false),
		},
	};
};

export default useAudioPlayer;
