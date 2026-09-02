'use client';

import { useUpdateAudioSegmentMemo } from '@/hooks/apis/use-audio-segments';

import MemoEditor from '@/app/(backoffice)/captures/[id]/_components/memo-editor';
import { toast } from 'sonner';

interface AudioSegmentMemoProps {
	audioCaptureId: string;
	segmentId: string;
	memo: string | null;
}

export default function AudioSegmentMemo({ audioCaptureId, segmentId, memo }: AudioSegmentMemoProps) {
	const updateMemo = useUpdateAudioSegmentMemo(audioCaptureId);

	return (
		<div className="mt-1.5">
			<MemoEditor
				memo={memo}
				isPending={updateMemo.isPending}
				onSave={(value) =>
					updateMemo.mutate(
						{ audioSegmentId: segmentId, data: { memo: value } },
						{ onError: () => toast.error('메모 저장에 실패했습니다.') },
					)
				}
			/>
		</div>
	);
}
