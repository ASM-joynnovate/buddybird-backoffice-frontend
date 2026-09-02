'use client';

import { useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { exportAudioSegments } from '@/apis/exports';

import { ExportAudioSegmentsParams } from '@/types/apis/audio-captures';

import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export default function ExportButton() {
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);

	const handleExport = async () => {
		setLoading(true);
		try {
			const labelOptionIds = searchParams.getAll('labelOptionIds');

			const params: ExportAudioSegmentsParams = {
				audioCaptureLabelOptionIds: labelOptionIds.length ? labelOptionIds : undefined,
			};

			const { blob, filename } = await exportAudioSegments(params);

			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename ?? 'segments-export.zip';
			a.click();
			URL.revokeObjectURL(url);
		} catch {
			toast.error('내보내기에 실패했습니다.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Button onClick={handleExport} disabled={loading}>
			{loading && <LoaderCircle className="animate-spin" />}
			내보내기
		</Button>
	);
}
