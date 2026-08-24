'use client';

import { useState } from 'react';

import { useUpdateAudioSegmentMemo } from '@/hooks/apis/use-audio-segments';

import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AudioSegmentMemoProps {
	audioCaptureId: string;
	segmentId: string;
	memo: string | null;
}

export default function AudioSegmentMemo({ audioCaptureId, segmentId, memo }: AudioSegmentMemoProps) {
	const [value, setValue] = useState(memo ?? '');

	const updateMemo = useUpdateAudioSegmentMemo(audioCaptureId);

	return (
		<div className="mt-1.5 overflow-hidden rounded-lg border">
			<Textarea
				value={value}
				onChange={(e) => setValue(e.target.value)}
				placeholder="메모"
				className="h-20 resize-none overflow-scroll rounded-none border-none text-xs shadow-none
					focus-visible:ring-0"
				onClick={(e) => e.stopPropagation()}
			/>
			<div className="flex justify-end gap-1 border-t px-2 py-1.5">
				<Button
					variant="ghost"
					size="sm"
					onClick={(e) => {
						e.stopPropagation();
						setValue(memo ?? '');
					}}
				>
					취소
				</Button>
				<Button
					size="sm"
					disabled={updateMemo.isPending}
					onClick={(e) => {
						e.stopPropagation();
						updateMemo.mutate(
							{ audioSegmentId: segmentId, data: { memo: value } },
							{ onError: () => toast.error('메모 저장에 실패했습니다.') },
						);
					}}
				>
					{updateMemo.isPending && <Loader2Icon className="animate-spin" />}
					저장
				</Button>
			</div>
		</div>
	);
}
