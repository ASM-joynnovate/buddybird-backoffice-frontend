/** 음성 길이를 "0.9초", "1:05" 형식으로 변환하는 함수 */
export const formatAudioDuration = (durationSeconds: number) => {
	if (durationSeconds < 60) {
		return `${durationSeconds.toFixed(1)}초`;
	}

	const roundedSeconds = Math.round(durationSeconds);

	return `${Math.floor(roundedSeconds / 60)}:${String(roundedSeconds % 60).padStart(2, '0')}`;
};
