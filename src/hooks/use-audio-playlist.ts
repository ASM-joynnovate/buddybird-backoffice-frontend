import { type SyntheticEvent, useEffect, useRef, useState } from 'react';

import { isLastPlayedAudio, stopOtherAudio } from '@/lib/audio';

import { NEXT_SOUND_DELAY_MS } from '@/config';

interface PlaylistSound {
	id: string;
	audio_file: { url: string };
}

/**
 * 소리 목록을 차례로 재생하는 Hook
 * @param sounds 시각 순서의 소리 목록
 */
const useAudioPlaylist = (sounds: PlaylistSound[]) => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const nextSoundTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	const [currentSoundId, setCurrentSoundId] = useState<string | null>(null);
	const [playing, setPlaying] = useState(false);
	const [playbackFailed, setPlaybackFailed] = useState(false);
	const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
	const [continuousPlayEnabled, setContinuousPlayEnabled] = useState(true);

	const currentIndex = sounds.findIndex((sound) => sound.id === currentSoundId);
	const previousSound = currentIndex > 0 ? sounds[currentIndex - 1] : undefined;
	const nextSound = currentIndex >= 0 ? sounds[currentIndex + 1] : undefined;

	/** 화면을 떠나면 다음 소리 재생 취소 */
	useEffect(() => {
		return () => clearTimeout(nextSoundTimerRef.current);
	}, []);

	/** 소리를 처음부터 재생하는 함수 */
	const playSound = (sound: PlaylistSound) => {
		const audio = audioRef.current;

		if (!audio) {
			return;
		}

		clearTimeout(nextSoundTimerRef.current);

		setCurrentSoundId(sound.id);
		setPlaybackFailed(false);
		setDurationSeconds(null);

		audio.src = sound.audio_file.url;
		audio.play().catch((error: unknown) => {
			// 브라우저가 재생을 막으면 error 이벤트 없이 끝남
			if (error instanceof DOMException && error.name === 'NotAllowedError') {
				setPlaying(false);
			}
		});
	};

	/** 재생을 정지하는 함수 */
	const stopSound = () => {
		const audio = audioRef.current;

		clearTimeout(nextSoundTimerRef.current);

		if (audio) {
			audio.pause();
			audio.currentTime = 0;
		}

		setPlaying(false);
	};

	const handleTogglePlay = () => {
		if (playing) {
			stopSound();

			return;
		}

		const sound = sounds[currentIndex] ?? sounds[0];

		if (sound) {
			playSound(sound);
		}
	};

	const handlePlayPrevious = () => {
		if (previousSound) {
			playSound(previousSound);
		}
	};

	const handlePlayNext = () => {
		if (nextSound) {
			playSound(nextSound);
		}
	};

	const handleToggleContinuousPlay = () => {
		// 다음 소리를 기다리는 중에 끄면 정지
		if (continuousPlayEnabled && playing && audioRef.current?.paused) {
			stopSound();
		}

		setContinuousPlayEnabled(!continuousPlayEnabled);
	};

	const handleLoadedMetadata = (event: SyntheticEvent<HTMLAudioElement>) => {
		const { duration } = event.currentTarget;

		setDurationSeconds(Number.isFinite(duration) ? duration : null);
	};

	const handlePlay = (event: SyntheticEvent<HTMLAudioElement>) => {
		stopOtherAudio(event.currentTarget);

		setPlaying(true);
	};

	const handlePause = (event: SyntheticEvent<HTMLAudioElement>) => {
		// 끝까지 재생한 경우는 handleEnded에서 처리
		if (!event.currentTarget.ended) {
			setPlaying(false);
		}
	};

	const handleEnded = () => {
		if (!continuousPlayEnabled || !nextSound) {
			setPlaying(false);

			return;
		}

		nextSoundTimerRef.current = setTimeout(() => {
			// 기다리는 동안 다른 음성을 재생하면 멈춤
			if (audioRef.current && !isLastPlayedAudio(audioRef.current)) {
				setPlaying(false);

				return;
			}

			playSound(nextSound);
		}, NEXT_SOUND_DELAY_MS);
	};

	const handleError = () => {
		clearTimeout(nextSoundTimerRef.current);

		setPlaybackFailed(true);
		setPlaying(false);
	};

	return {
		currentSoundId,
		previousSound,
		nextSound,
		playing,
		playbackFailed,
		durationSeconds,
		continuousPlayEnabled,
		playSound,
		handleTogglePlay,
		handlePlayPrevious,
		handlePlayNext,
		handleToggleContinuousPlay,
		audioProps: {
			ref: audioRef,
			onLoadedMetadata: handleLoadedMetadata,
			onPlay: handlePlay,
			onPause: handlePause,
			onEnded: handleEnded,
			onError: handleError,
		},
	};
};

export type AudioPlaylist = ReturnType<typeof useAudioPlaylist>;

export default useAudioPlaylist;
