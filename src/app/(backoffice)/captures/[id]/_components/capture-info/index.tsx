import { AudioCaptureDetail, PHASE_LABEL } from '@/types/audio-capture';

import { formatMs } from '@/lib/utils';

import CaptureInfoCard from '@/app/(backoffice)/captures/[id]/_components/capture-info/capture-info-card';
import CaptureInfoField from '@/app/(backoffice)/captures/[id]/_components/capture-info/capture-info-field';
import dayjs from 'dayjs';

interface CaptureInfoProps {
	capture: AudioCaptureDetail;
}

export default function CaptureInfo({ capture }: CaptureInfoProps) {
	const deviceOs = [capture.devicePlatform, capture.deviceOsVersion].filter(Boolean).join(' ');
	const wordDeviceOs = [capture.word?.devicePlatform, capture.word?.deviceOsVersion].filter(Boolean).join(' ');

	return (
		<div className="grid grid-cols-1 items-start gap-3">
			<CaptureInfoCard title="오디오 정보">
				<CaptureInfoField label="구간" value={PHASE_LABEL[capture.phase]} />
				<CaptureInfoField label="사이클" value={capture.cycle} />
				<CaptureInfoField label="길이" value={capture.durationMs ? formatMs(capture.durationMs) : '-'} />
				<CaptureInfoField label="캡처 시각" value={new Date(capture.capturedAt).toLocaleString('ko')} />
			</CaptureInfoCard>
			<CaptureInfoCard title="캡처 사용자 · 기기">
				<CaptureInfoField
					label="사용자 ID"
					value={capture.firebaseAnonUid}
					className="font-mono text-xs break-all"
				/>
				<CaptureInfoField label="모델명" value={capture.deviceModel ?? '-'} />
				<CaptureInfoField label="OS" value={deviceOs || '-'} />
			</CaptureInfoCard>
			<CaptureInfoCard title="앵무새 정보">
				<CaptureInfoField label="종" value={capture.parrotSpecies ?? '-'} />
				<CaptureInfoField
					label="생년월일"
					value={capture.parrotBirthdate ? dayjs(capture.parrotBirthdate).format('YYYY.MM.DD') : '-'}
				/>
			</CaptureInfoCard>
			<CaptureInfoCard title="단어 정보">
				<CaptureInfoField label="단어명" value={capture.word?.label ?? '-'} />
				<CaptureInfoField label="단어 녹음 기기" value={capture.word?.deviceModel ?? '-'} />
				<CaptureInfoField label="단어 녹음 OS" value={wordDeviceOs || '-'} />
				<div className="relative col-span-full border-t pt-3">
					<dt className="sr-only">단어 식별 정보</dt>
					<dd>
						<details>
							<summary
								className="w-fit cursor-pointer rounded-sm text-sm font-medium focus-visible:outline-2
									focus-visible:outline-offset-4"
							>
								식별 정보
							</summary>
							<dl className="mt-3 grid gap-3">
								<CaptureInfoField
									label="서버 단어 ID"
									value={capture.word?.id ?? '-'}
									className="font-mono text-xs break-all"
								/>
								<CaptureInfoField
									label="클라이언트 단어 ID"
									value={capture.word?.clientWordId ?? '-'}
									className="font-mono text-xs break-all"
								/>
								<CaptureInfoField
									label="단어 사용자 ID"
									value={capture.word?.firebaseAnonUid ?? '-'}
									className="font-mono text-xs break-all"
								/>
							</dl>
						</details>
					</dd>
				</div>
			</CaptureInfoCard>
		</div>
	);
}
