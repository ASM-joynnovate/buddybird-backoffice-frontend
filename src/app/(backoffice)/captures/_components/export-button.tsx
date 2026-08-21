'use client';

import { useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { exportAudioSegments } from '@/apis/exports';

import { AudioCaptureListParams } from '@/types/apis/audio-captures';

import { LabelStatusEnum } from '@/types/audio-capture';

import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export default function ExportButton() {
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);

	const handleExport = async () => {
		setLoading(true);
		try {
			const params: AudioCaptureListParams = {
				firebaseAnonUid: searchParams.get('firebaseAnonUid') ?? undefined,
				wordLabel: searchParams.get('wordLabel') ?? undefined,
				labelStatus: (searchParams.get('labelStatus') as LabelStatusEnum) || undefined,
				dateFrom: searchParams.get('dateFrom') ?? undefined,
				dateTo: searchParams.get('dateTo') ?? undefined,
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
