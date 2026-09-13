'use client';

import Link from 'next/link';
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
			<div
				className="min-h-0 flex-1 overflow-hidden rounded-lg border
					capture-desktop:[&>[data-slot=table-container]]:h-full
					capture-desktop:[&>[data-slot=table-container]]:overflow-auto"
			>
				<Table>
					<TableHeader
						className="capture-desktop:sticky capture-desktop:top-0 capture-desktop:z-10
							capture-desktop:bg-card"
					>
						<TableRow>
							<TableHead>사용자 ID</TableHead>
							<TableHead>단어</TableHead>
							<TableHead>앵무새 종</TableHead>
							<TableHead>구간</TableHead>
							<TableHead>사이클</TableHead>
							<TableHead>캡처 시각</TableHead>
							<TableHead>길이</TableHead>
							<TableHead>캡처 기기</TableHead>
							<TableHead>라벨</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.data.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={9}
									className="h-32 text-center whitespace-normal text-muted-foreground"
								>
									검색 조건에 맞는 캡처가 없습니다. 조건을 변경하거나 초기화해 주세요.
								</TableCell>
							</TableRow>
						)}
						{data.data.map((capture) => (
							<TableRow
								key={capture.id}
								className="cursor-pointer"
								onClick={() => router.push(`/captures/${capture.id}?${searchParams.toString()}`)}
							>
								<TableCell
									title={capture.firebaseAnonUid}
									className="max-w-32 truncate font-mono text-xs text-muted-foreground"
								>
									{capture.firebaseAnonUid}
								</TableCell>
								<TableCell className="max-w-48 min-w-36 wrap-anywhere whitespace-normal">
									<Link
										href={`/captures/${capture.id}?${searchParams.toString()}`}
										onClick={(event) => event.stopPropagation()}
										className="rounded-sm font-medium underline-offset-4 hover:underline
											focus-visible:outline-2 focus-visible:outline-offset-4"
										aria-label={`${capture.word?.label ?? '-'} 캡처 상세 보기`}
									>
										{capture.word?.label ?? '-'}
									</Link>
								</TableCell>
								<TableCell className="max-w-32 min-w-24 wrap-anywhere whitespace-normal">
									{capture.parrotSpecies ?? '-'}
								</TableCell>
								<TableCell>{capture.phase}</TableCell>
								<TableCell>{capture.cycle}</TableCell>
								<TableCell>{dayjs(capture.capturedAt).format('YYYY.MM.DD HH:mm')}</TableCell>
								<TableCell>
									{capture.durationMs ? `${(capture.durationMs / 1000).toFixed(1)}s` : '-'}
								</TableCell>
								<TableCell className="max-w-48 min-w-36 wrap-anywhere whitespace-normal">
									<div>{capture.deviceModel ?? '-'}</div>
									<div className="text-xs text-muted-foreground">
										{[capture.devicePlatform, capture.deviceOsVersion].filter(Boolean).join(' ') ||
											'-'}
									</div>
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

			<PaginatedNavigation meta={meta} buildHref={buildHref} className="mt-auto shrink-0 pt-6 pb-2" />
		</>
	);
}
