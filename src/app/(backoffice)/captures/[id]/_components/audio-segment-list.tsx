'use client';

import { useGetAudioCaptureDetail } from '@/hooks/apis/use-audio-captures';
import { useGetLabelList } from '@/hooks/apis/use-labels';

import { Button } from '@/components/ui/button';

import AudioSegmentItem from './audio-segment-item';

interface AudioSegmentListProps {
	audioCaptureId: string;
	selectedSegmentId: string | null;
	onSegmentSelect: (segmentId: string) => void;
	onSegmentPlay: (segmentId: string) => void;
	onRunVad: () => void;
	isVadPending: boolean;
}

export default function AudioSegmentList({
	audioCaptureId,
	selectedSegmentId,
	onSegmentSelect,
	onSegmentPlay,
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
			{capture.segments.map((seg) => (
				<AudioSegmentItem
					key={seg.id}
					audioCaptureId={audioCaptureId}
					segment={seg}
					isSelected={selectedSegmentId === seg.id}
					labels={labels}
					labelItems={labelItems}
					onSelect={onSegmentSelect}
					onPlay={onSegmentPlay}
				/>
			))}
		</div>
	);
}
