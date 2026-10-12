import { type SyntheticEvent, useEffect, useRef, useState } from 'react';

import { isLastPlayedAudio, stopOtherAudio } from '@/lib/audio';

import { NEXT_SOUND_DELAY_MS } from '@/config';

interface PlaylistSound {
	id: string;
	audio_file: { url: string };
}

interface SoundGroup {
	id: string;
	sounds: PlaylistSound[];
}

/**
 * 소리 목록을 차례로 재생하는 Hook
 * @param sounds 시각 순서의 소리 목록
 */
const useAudioPlaylist = (sounds: PlaylistSound[]) => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const nextSoundTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	const [currentSoundId, setCurrentSoundId] = useState<string | null>(null);
	const [playingSoundGroup, setPlayingSoundGroup] = useState<SoundGroup | null>(null);
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

	/** 재생이 끝난 상태로 변경하는 함수 */
	const finishPlaying = () => {
		setPlaying(false);
		setPlayingSoundGroup(null);
	};

	/** 소리를 처음부터 재생하는 함수 */
	const startSound = (sound: PlaylistSound) => {
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
				finishPlaying();
			}
		});
	};

	/** 선택한 소리를 재생하는 함수 */
	const playSound = (sound: PlaylistSound) => {
		setPlayingSoundGroup(null);

		startSound(sound);
	};

	/** 재생을 정지하는 함수 */
	const stopSound = () => {
		const audio = audioRef.current;

		clearTimeout(nextSoundTimerRef.current);

		if (audio) {
			audio.pause();
			audio.currentTime = 0;
		}

		finishPlaying();
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

	/** 묶음의 소리만 처음부터 끝까지 재생하거나 정지 */
	const handleToggleSoundGroup = (soundGroup: SoundGroup) => {
		if (playing && playingSoundGroup?.id === soundGroup.id) {
			stopSound();

			return;
		}

		const firstSound = soundGroup.sounds.at(0);

		if (firstSound) {
			setPlayingSoundGroup(soundGroup);

			startSound(firstSound);
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
			finishPlaying();
		}
	};

	const handleEnded = () => {
		// 묶음을 재생 중이면 묶음 안의 다음 소리만 재생
		const queuedSound = playingSoundGroup
			? playingSoundGroup.sounds[playingSoundGroup.sounds.findIndex((sound) => sound.id === currentSoundId) + 1]
			: continuousPlayEnabled
				? nextSound
				: undefined;

		if (!queuedSound) {
			finishPlaying();

			return;
		}

		nextSoundTimerRef.current = setTimeout(() => {
			// 기다리는 동안 다른 음성을 재생하면 멈춤
			if (audioRef.current && !isLastPlayedAudio(audioRef.current)) {
				finishPlaying();

				return;
			}

			startSound(queuedSound);
		}, NEXT_SOUND_DELAY_MS);
	};

	const handleError = () => {
		clearTimeout(nextSoundTimerRef.current);

		setPlaybackFailed(true);
		finishPlaying();
	};

	return {
		currentSoundId,
		previousSound,
		nextSound,
		playing,
		playingSoundGroupId: playing ? (playingSoundGroup?.id ?? null) : null,
		playbackFailed,
		durationSeconds,
		continuousPlayEnabled,
		playSound,
		handleTogglePlay,
		handleToggleSoundGroup,
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
