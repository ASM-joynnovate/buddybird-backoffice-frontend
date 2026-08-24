'use client';

import { useGetAudioCaptureDetail } from '@/hooks/apis/use-audio-captures';
import { useGetLabelList } from '@/hooks/apis/use-labels';

import { Button } from '@/components/ui/button';

import AudioSegmentItem from './audio-segment-item';

interface AudioSegmentListProps {
	audioCaptureId: string;
	hoveredSegmentId: string | null;
	onSegmentPlay: (segmentId: string) => void;
	onSegmentHover: (segmentId: string | null) => void;
	onRunVad: () => void;
	isVadPending: boolean;
}

export default function AudioSegmentList({
	audioCaptureId,
	hoveredSegmentId,
	onSegmentPlay,
	onSegmentHover,
	onRunVad,
	isVadPending,
}: AudioSegmentListProps) {
	const { data: capture } = useGetAudioCaptureDetail(audioCaptureId);
	const { data: labels } = useGetLabelList();

	const labelItems = Object.fromEntries(labels.flatMap((c) => c.options.map((o) => [o.id, o.name])));

	return (
		<div className="rounded-lg border bg-card">
			<div className="flex items-center justify-between border-b px-4 py-3">
				<span className="text-sm font-semibold">세그먼트</span>
				<Button variant="outline" size="sm" onClick={onRunVad} disabled={isVadPending}>
					VAD 실행
				</Button>
			</div>
			<div className="max-h-[50vh] overflow-y-auto">
				{capture.segments.map((seg) => (
					<AudioSegmentItem
						key={seg.id}
						audioCaptureId={audioCaptureId}
						segment={seg}
						isHighlighted={hoveredSegmentId === seg.id}
						labels={labels}
						labelItems={labelItems}
						onPlay={onSegmentPlay}
						onHover={onSegmentHover}
					/>
				))}
			</div>
		</div>
	);
}
