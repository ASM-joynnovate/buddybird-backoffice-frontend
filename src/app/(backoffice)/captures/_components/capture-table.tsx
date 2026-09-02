'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { AudioCaptureListParams } from '@/types/apis/audio-captures';

import { useGetAudioCaptureList } from '@/hooks/apis/use-audio-captures';
import { useGetLabelList } from '@/hooks/apis/use-labels';

import dayjs from 'dayjs';

import PaginatedNavigation from '@/components/paginated-navigation';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CaptureTableProps {
	params: AudioCaptureListParams;
}

export default function CaptureTable({ params }: CaptureTableProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data } = useGetAudioCaptureList(params);
	const { data: labels } = useGetLabelList();
	const { meta } = data;

	const labelOptionMap = Object.fromEntries(labels.flatMap((c) => c.options.map((o) => [o.id, o.name])));

	const buildHref = (page: number) => {
		const p = new URLSearchParams(searchParams.toString());
		p.set('page', String(page));
		return `/captures?${p.toString()}`;
	};

	return (
		<>
			<div className="flex-1 overflow-x-auto rounded-lg border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>사용자 ID</TableHead>
							<TableHead>단어</TableHead>
							<TableHead>구간</TableHead>
							<TableHead>사이클</TableHead>
							<TableHead>캡처 시각</TableHead>
							<TableHead>길이</TableHead>
							<TableHead>라벨</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.data.map((capture) => (
							<TableRow
								key={capture.id}
								className="cursor-pointer"
								onClick={() => router.push(`/captures/${capture.id}?${searchParams.toString()}`)}
							>
								<TableCell className="max-w-32 truncate font-mono text-xs text-muted-foreground">
									{capture.firebaseAnonUid}
								</TableCell>
								<TableCell>{capture.clientWordId}</TableCell>
								<TableCell>{capture.phase}</TableCell>
								<TableCell>{capture.cycle}</TableCell>
								<TableCell>{dayjs(capture.capturedAt).format('YYYY.MM.DD HH:mm')}</TableCell>
								<TableCell>
									{capture.durationMs ? `${(capture.durationMs / 1000).toFixed(1)}s` : '-'}
								</TableCell>
								<TableCell>
									<div className="flex flex-wrap gap-1">
										{capture.labelOptionIds.length > 0 ? (
											capture.labelOptionIds.map((optionId) => (
												<Badge key={optionId} variant="default">
													{labelOptionMap[optionId] ?? optionId}
												</Badge>
											))
										) : (
											<Badge variant="secondary">없음</Badge>
										)}
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<PaginatedNavigation meta={meta} buildHref={buildHref} className="mt-auto pt-6 pb-2" />
		</>
	);
}
