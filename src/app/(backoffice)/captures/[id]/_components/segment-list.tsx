'use client';

import { useGetAudioCaptureDetail } from '@/hooks/apis/use-audio-captures';
import { useAssignAudioSegmentLabel, useDeleteAudioSegment } from '@/hooks/apis/use-audio-segments';
import { useGetLabelList } from '@/hooks/apis/use-labels';

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

interface SegmentListProps {
	audioCaptureId: string;
	selectedSegmentId: string | null;
	onSegmentSelect: (segmentId: string) => void;
	onSegmentPlay: (segmentId: string) => void;
	onRunVad: () => void;
	isVadPending: boolean;
}

export default function SegmentList({
	audioCaptureId,
	selectedSegmentId,
	onSegmentSelect,
	onSegmentPlay,
	onRunVad,
	isVadPending,
}: SegmentListProps) {
	const { data: capture } = useGetAudioCaptureDetail(audioCaptureId);
	const { data: labels } = useGetLabelList();

	const assignLabel = useAssignAudioSegmentLabel(audioCaptureId);
	const deleteSegment = useDeleteAudioSegment(audioCaptureId);

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
				<div
					key={seg.id}
					className={cn(
						'flex cursor-pointer items-center gap-3 border-b px-4 py-2 last:border-b-0',
						selectedSegmentId === seg.id && 'bg-accent/5',
					)}
					onClick={() => onSegmentSelect(seg.id)}
				>
					<Button
						variant="outline"
						size="icon-sm"
						className="shrink-0 rounded-full"
						onClick={(e) => {
							e.stopPropagation();
							onSegmentPlay(seg.id);
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
									if (value)
										assignLabel.mutate({ audioSegmentId: seg.id, data: { labelOptionId: value } });
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
					</div>
					<Button
						variant="ghost"
						size="icon-sm"
						className="shrink-0 text-muted-foreground hover:text-destructive"
						onClick={(e) => {
							e.stopPropagation();
							deleteSegment.mutate(seg.id);
						}}
					>
						<XIcon className="size-3.5" />
					</Button>
				</div>
			))}
		</div>
	);
}
