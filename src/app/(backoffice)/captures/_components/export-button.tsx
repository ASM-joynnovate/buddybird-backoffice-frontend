'use client';

import { useState } from 'react';

import { exportAudioSegments } from '@/apis/exports';

import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

export default function ExportButton() {
	const [loading, setLoading] = useState(false);

	const handleExport = async () => {
		setLoading(true);
		try {
			const { blob, filename } = await exportAudioSegments();

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
		<div className="flex flex-col items-start gap-1.5 sm:items-end">
			<Button onClick={handleExport} disabled={loading} aria-describedby="export-description">
				{loading && <LoaderCircle className="animate-spin" />}
				전체 내보내기
			</Button>
		</div>
	);
}
