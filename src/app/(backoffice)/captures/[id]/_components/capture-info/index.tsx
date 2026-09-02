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

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
			<CaptureInfoCard title="오디오 정보">
				<CaptureInfoField label="단어" value={capture.clientWordId} />
				<CaptureInfoField label="구간" value={PHASE_LABEL[capture.phase]} />
				<CaptureInfoField label="사이클" value={capture.cycle} />
				<CaptureInfoField label="길이" value={capture.durationMs ? formatMs(capture.durationMs) : '-'} />
				<CaptureInfoField label="캡처 시각" value={new Date(capture.capturedAt).toLocaleString('ko')} />
			</CaptureInfoCard>
			<CaptureInfoCard title="사용자 정보">
				<CaptureInfoField
					label="사용자 ID"
					value={capture.firebaseAnonUid}
					className="truncate font-mono text-xs"
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
		</div>
	);
}
