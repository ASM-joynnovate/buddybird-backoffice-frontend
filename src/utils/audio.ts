const WAV_HEADER_BYTES = 12;
const WAV_CHUNK_HEADER_BYTES = 8;

/** 음성 길이를 "0.9초", "1:05" 형식으로 변환하는 함수 */
export const formatAudioDuration = (durationSeconds: number) => {
	if (durationSeconds < 60) {
		return `${durationSeconds.toFixed(1)}초`;
	}

	const roundedSeconds = Math.round(durationSeconds);

	return `${Math.floor(roundedSeconds / 60)}:${String(roundedSeconds % 60).padStart(2, '0')}`;
};

/** WAV 파일에서 이름이 같은 chunk의 내용을 찾는 함수 */
const findWavChunk = (wavFile: ArrayBuffer, chunkName: string) => {
	const view = new DataView(wavFile);

	let offset = WAV_HEADER_BYTES;

	while (offset + WAV_CHUNK_HEADER_BYTES <= wavFile.byteLength) {
		const name = String.fromCharCode(...new Uint8Array(wavFile, offset, 4));
		const contentStart = offset + WAV_CHUNK_HEADER_BYTES;
		// 헤더에 적힌 크기가 파일보다 크면 파일 끝까지
		const contentBytes = Math.min(view.getUint32(offset + 4, true), wavFile.byteLength - contentStart);

		if (name === chunkName) {
			return new Uint8Array(wavFile, contentStart, contentBytes);
		}

		// chunk는 짝수 바이트 단위로 이어짐
		offset = contentStart + contentBytes + (contentBytes % 2);
	}

	return null;
};

/** WAV 파일 여러 개를 순서대로 이어 붙인 WAV 파일을 반환하는 함수 */
export const joinWavFiles = (wavFiles: ArrayBuffer[]) => {
	// ponytail: 모든 파일이 첫 파일과 같은 형식
	const format = wavFiles.map((wavFile) => findWavChunk(wavFile, 'fmt ')).find((chunk) => chunk !== null);
	const samples = wavFiles.flatMap((wavFile) => findWavChunk(wavFile, 'data') ?? []);

	if (!format) {
		throw new Error('WAV format chunk not found');
	}

	const sampleBytes = samples.reduce((total, sample) => total + sample.byteLength, 0);
	const header = new DataView(new ArrayBuffer(WAV_HEADER_BYTES + WAV_CHUNK_HEADER_BYTES * 2 + format.byteLength));
	const headerBytes = new Uint8Array(header.buffer);
	const formatStart = WAV_HEADER_BYTES + WAV_CHUNK_HEADER_BYTES;
	const dataHeaderStart = formatStart + format.byteLength;

	headerBytes.set(new TextEncoder().encode('RIFF'), 0);
	header.setUint32(4, header.byteLength - WAV_CHUNK_HEADER_BYTES + sampleBytes, true);
	headerBytes.set(new TextEncoder().encode('WAVEfmt '), 8);
	header.setUint32(16, format.byteLength, true);
	headerBytes.set(format, formatStart);
	headerBytes.set(new TextEncoder().encode('data'), dataHeaderStart);
	header.setUint32(dataHeaderStart + 4, sampleBytes, true);

	return new Blob([headerBytes, ...samples], { type: 'audio/wav' });
};
