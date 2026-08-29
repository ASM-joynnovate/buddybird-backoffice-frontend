'use client';

import { useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { AudioCaptureListParams } from '@/types/apis/audio-captures';

import { LabelCategoryTargetEnum } from '@/types/label';

import {
	getAudioCaptureListOptions,
	useAssignAudioCaptureLabels,
	useGetAudioCaptureDetail,
} from '@/hooks/apis/use-audio-captures';
import { useRunAudioCaptureVad } from '@/hooks/apis/use-audio-segments';
import { useGetLabelList } from '@/hooks/apis/use-labels';

import { cn, formatMs } from '@/lib/utils';

import AudioSegmentList from '@/app/(backoffice)/captures/[id]/_components/audio-segment-list';
import WaveformEditor, { WaveformEditorHandle } from '@/app/(backoffice)/captures/[id]/_components/waveform-editor';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface LabelingWorkspaceProps {
	audioCaptureId: string;
}

export default function LabelingWorkspace({ audioCaptureId }: LabelingWorkspaceProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data: capture } = useGetAudioCaptureDetail(audioCaptureId);
	const { data: labels } = useGetLabelList();
	const waveformRef = useRef<WaveformEditorHandle>(null);

	const [hoveredSegmentId, setHoveredSegmentId] = useState<string | null>(null);

	const runVad = useRunAudioCaptureVad(audioCaptureId);
	const assignCaptureLabels = useAssignAudioCaptureLabels(audioCaptureId);

	const captureLabels = labels.filter((c) => c.target === LabelCategoryTargetEnum.CAPTURE);

	const currentPage = Number(searchParams.get('page')) || 1;
	const labelOptionIds = searchParams.getAll('labelOptionIds');
	const listParams: AudioCaptureListParams = {
		page: currentPage,
		countByPage: Number(searchParams.get('countByPage')) || 12,
		firebaseAnonUid: searchParams.get('firebaseAnonUid') || undefined,
		wordLabel: searchParams.get('wordLabel') || undefined,
		labelOptionIds: labelOptionIds.length ? labelOptionIds : undefined,
		dateFrom: searchParams.get('dateFrom') || undefined,
		dateTo: searchParams.get('dateTo') || undefined,
	};

	const { data: listData } = useQuery(getAudioCaptureListOptions(listParams));
	const items = listData?.data ?? [];
	const meta = listData?.meta;
	const currentIndex = items.findIndex((c) => c.id === audioCaptureId);
	const found = currentIndex !== -1;

	const isFirstInPage = found && currentIndex === 0;
	const isLastInPage = found && currentIndex === items.length - 1;
	const isFirstPage = meta?.isFirst ?? true;
	const isLastPage = meta?.isLast ?? true;

	const { data: prevPageData } = useQuery({
		...getAudioCaptureListOptions({ ...listParams, page: currentPage - 1 }),
		enabled: isFirstInPage && !isFirstPage,
	});
	const { data: nextPageData } = useQuery({
		...getAudioCaptureListOptions({ ...listParams, page: currentPage + 1 }),
		enabled: isLastInPage && !isLastPage,
	});

	const prevCapture = !found ? undefined : isFirstInPage ? prevPageData?.data.at(-1) : items[currentIndex - 1];
	const nextCapture = !found ? undefined : isLastInPage ? nextPageData?.data.at(0) : items[currentIndex + 1];

	const prevTargetPage = isFirstInPage ? currentPage - 1 : currentPage;
	const nextTargetPage = isLastInPage ? currentPage + 1 : currentPage;

	const navigateTo = (captureId: string, page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', String(page));
		router.push(`/captures/${captureId}?${params.toString()}`);
	};

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardContent className="p-4">
					<dl className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-x-6 gap-y-3">
						<div>
							<dt className="text-xs font-medium text-muted-foreground">단어</dt>
							<dd className="text-sm font-semibold">{capture.clientWordId}</dd>
						</div>
						<div>
							<dt className="text-xs font-medium text-muted-foreground">구간</dt>
							<dd className="text-sm font-semibold">{capture.phase}</dd>
						</div>
						<div>
							<dt className="text-xs font-medium text-muted-foreground">사이클</dt>
							<dd className="text-sm font-semibold">{capture.cycle}</dd>
						</div>
						<div>
							<dt className="text-xs font-medium text-muted-foreground">길이</dt>
							<dd className="text-sm font-semibold">
								{capture.durationMs ? formatMs(capture.durationMs) : '-'}
							</dd>
						</div>
						<div>
							<dt className="text-xs font-medium text-muted-foreground">사용자</dt>
							<dd className="truncate font-mono text-xs">{capture.firebaseAnonUid}</dd>
						</div>
						<div>
							<dt className="text-xs font-medium text-muted-foreground">캡처 시각</dt>
							<dd className="text-sm font-semibold">
								{new Date(capture.capturedAt).toLocaleString('ko')}
							</dd>
						</div>
					</dl>
				</CardContent>
			</Card>

			<WaveformEditor
				ref={waveformRef}
				audioCaptureId={audioCaptureId}
				highlightedSegmentId={hoveredSegmentId}
				onSegmentHover={setHoveredSegmentId}
			/>

			<Card>
				<div className="flex items-center justify-between border-b px-4 py-3">
					<span className="text-sm font-semibold">클립 라벨</span>
					{capture.labelOptionIds.length > 0 && (
						<Badge variant="secondary">{capture.labelOptionIds.length}개 선택</Badge>
					)}
				</div>
				<CardContent className="p-4">
					{captureLabels.length === 0 ? (
						<p className="text-xs text-muted-foreground">
							클립 대상 라벨 카테고리가 없습니다. 라벨 관리에서 먼저 추가해 주세요.
						</p>
					) : (
						<div
							className={cn(
								'space-y-3',
								assignCaptureLabels.isPending && 'pointer-events-none opacity-50',
							)}
						>
							{captureLabels.map((category) => (
								<div key={category.id}>
									<p className="mb-1.5 text-xs font-medium text-muted-foreground">{category.name}</p>
									<div className="flex flex-wrap gap-1.5">
										{category.options.map((option) => {
											const selected = capture.labelOptionIds.includes(option.id);
											return (
												<Badge
													key={option.id}
													variant={selected ? 'default' : 'outline'}
													className="cursor-pointer"
													render={<button type="button" />}
													aria-pressed={selected}
													onClick={() => {
														const next = selected
															? capture.labelOptionIds.filter((id) => id !== option.id)
															: [...capture.labelOptionIds, option.id];
														assignCaptureLabels.mutate({ labelOptionIds: next });
													}}
												>
													{option.name}
												</Badge>
											);
										})}
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			<AudioSegmentList
				audioCaptureId={audioCaptureId}
				hoveredSegmentId={hoveredSegmentId}
				onSegmentPlay={(segmentId) => waveformRef.current?.playSegment(segmentId)}
				onSegmentHover={setHoveredSegmentId}
				onRunVad={() => runVad.mutate()}
				isVadPending={runVad.isPending}
			/>

			<div className="sticky bottom-0 grid grid-cols-2 gap-2 border-t bg-background py-3">
				<Button
					variant="outline"
					className="py-5 text-sm font-semibold"
					disabled={!prevCapture}
					onClick={() => prevCapture && navigateTo(prevCapture.id, prevTargetPage)}
				>
					← 이전 클립
				</Button>
				<Button
					variant="outline"
					className="py-5 text-sm font-semibold"
					disabled={!nextCapture}
					onClick={() => nextCapture && navigateTo(nextCapture.id, nextTargetPage)}
				>
					다음 클립 →
				</Button>
			</div>
		</div>
	);
}
