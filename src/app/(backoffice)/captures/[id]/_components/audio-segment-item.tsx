'use client';

import type { AudioSegment } from '@/types/audio-segment';
import type { LabelCategory } from '@/types/label';

import { useAssignAudioSegmentLabel, useDeleteAudioSegment } from '@/hooks/apis/use-audio-segments';

import { cn, formatMs } from '@/lib/utils';

import { PlayIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import AudioSegmentMemo from './audio-segment-memo';

interface AudioSegmentItemProps {
	audioCaptureId: string;
	segment: AudioSegment;
	isSelected: boolean;
	labels: LabelCategory[];
	labelItems: Record<string, string>;
	onSelect: (segmentId: string) => void;
	onPlay: (segmentId: string) => void;
}

export default function AudioSegmentItem({
	audioCaptureId,
	segment: seg,
	isSelected,
	labels,
	labelItems,
	onSelect,
	onPlay,
}: AudioSegmentItemProps) {
	const assignLabel = useAssignAudioSegmentLabel(audioCaptureId);
	const deleteSegment = useDeleteAudioSegment(audioCaptureId);

	return (
		<div
			className={cn('flex items-start gap-3 border-b px-4 py-2 last:border-b-0', isSelected && 'bg-accent/5')}
			onClick={() => onSelect(seg.id)}
		>
			<Button
				variant="outline"
				size="icon-sm"
				className="mt-0.5 shrink-0 rounded-full"
				onClick={(e) => {
					e.stopPropagation();
					onPlay(seg.id);
				}}
			>
				<PlayIcon className="size-3" />
			</Button>
			<div className="flex-1">
				<div className="text-xs text-muted-foreground tabular-nums">
					{formatMs(seg.startMs)} – {formatMs(seg.endMs)}
				</div>
				<div className="mt-1">
					<Select
						value={seg.labelOptionId}
						items={labelItems}
						onValueChange={(value) => {
							if (value) assignLabel.mutate({ audioSegmentId: seg.id, data: { labelOptionId: value } });
						}}
					>
						<SelectTrigger className="h-7 text-xs">
							<SelectValue placeholder="라벨 선택" />
						</SelectTrigger>
						<SelectContent>
							{labels.map((category) => (
								<SelectGroup key={category.id}>
									<SelectLabel>{category.name}</SelectLabel>
									{category.options.map((option) => (
										<SelectItem key={option.id} value={option.id}>
											{option.name}
										</SelectItem>
									))}
								</SelectGroup>
							))}
						</SelectContent>
					</Select>
				</div>
				<AudioSegmentMemo audioCaptureId={audioCaptureId} segmentId={seg.id} memo={seg.memo} />
			</div>
			<Button
				variant="ghost"
				size="icon-sm"
				className="mt-0.5 shrink-0 text-muted-foreground hover:text-destructive"
				onClick={(e) => {
					e.stopPropagation();
					deleteSegment.mutate(seg.id);
				}}
			>
				<XIcon className="size-3.5" />
			</Button>
		</div>
	);
}
