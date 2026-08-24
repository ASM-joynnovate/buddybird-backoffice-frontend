'use client';

import type { AudioSegment } from '@/types/audio-segment';
import type { LabelCategory } from '@/types/label';

import { useAssignAudioSegmentLabel, useDeleteAudioSegment } from '@/hooks/apis/use-audio-segments';

import { cn, downloadFile, formatMs } from '@/lib/utils';

import { DownloadIcon, PlayIcon, XIcon } from 'lucide-react';

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
			className={cn('flex flex-col gap-1 border-b px-4 py-2 last:border-b-0', isSelected && 'bg-accent/5')}
			onClick={() => onSelect(seg.id)}
		>
			<div className="flex items-center gap-3">
				<div className="text-xs text-muted-foreground tabular-nums">
					{formatMs(seg.startMs)} – {formatMs(seg.endMs)}
				</div>
				<div className="flex-1" />
				<Select
					value={seg.labelOptionId}
					items={labelItems}
					onValueChange={(value) => {
						if (value) assignLabel.mutate({ audioSegmentId: seg.id, data: { labelOptionId: value } });
					}}
				>
					<SelectTrigger className="h-7 w-auto text-xs">
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
				<div
					data-slot="button-group"
					className="flex -space-x-px [&>*:not(:first-child)]:rounded-l-none
						[&>*:not(:last-child)]:rounded-r-none"
				>
					<Button
						variant="outline"
						size="icon-sm"
						onClick={(e) => {
							e.stopPropagation();
							downloadFile(seg.audioUrl);
						}}
					>
						<DownloadIcon className="size-3.5" />
					</Button>
					<Button
						variant="outline"
						size="icon-sm"
						onClick={(e) => {
							e.stopPropagation();
							onPlay(seg.id);
						}}
					>
						<PlayIcon className="size-3.5" />
					</Button>
					<Button
						variant="outline"
						size="icon-sm"
						className="text-muted-foreground hover:text-destructive"
						onClick={(e) => {
							e.stopPropagation();
							deleteSegment.mutate(seg.id);
						}}
					>
						<XIcon className="size-3.5" />
					</Button>
				</div>
			</div>
			<AudioSegmentMemo audioCaptureId={audioCaptureId} segmentId={seg.id} memo={seg.memo} />
		</div>
	);
}
