let playingAudio: HTMLAudioElement | null = null;

/** 재생을 시작한 음성 외의 음성을 정지하는 함수 */
export const stopOtherAudio = (audio: HTMLAudioElement) => {
	if (playingAudio && playingAudio !== audio) {
		playingAudio.pause();
		playingAudio.currentTime = 0;
	}

	playingAudio = audio;
};

/** 마지막으로 재생을 시작한 음성인지 확인하는 함수 */
export const isLastPlayedAudio = (audio: HTMLAudioElement) => {
	return playingAudio === audio;
};
