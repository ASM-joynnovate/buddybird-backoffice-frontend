'use client';

import { useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { AudioCaptureListParams } from '@/types/apis/audio-captures';

import { LabelStatusEnum } from '@/types/audio-capture';

import { getAudioCaptureListOptions, useGetAudioCaptureDetail } from '@/hooks/apis/use-audio-captures';
import { useRunAudioCaptureVad } from '@/hooks/apis/use-audio-segments';

import { formatMs } from '@/lib/utils';

import LabelPanel from '@/app/(backoffice)/captures/[id]/_components/label-panel';
import SegmentList from '@/app/(backoffice)/captures/[id]/_components/segment-list';
import WaveformEditor, { WaveformEditorHandle } from '@/app/(backoffice)/captures/[id]/_components/waveform-editor';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface LabelingWorkspaceProps {
	audioCaptureId: string;
}

export default function LabelingWorkspace({ audioCaptureId }: LabelingWorkspaceProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { data: capture } = useGetAudioCaptureDetail(audioCaptureId);
	const waveformRef = useRef<WaveformEditorHandle>(null);

	const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);

	const runVad = useRunAudioCaptureVad(audioCaptureId);

	const currentPage = Number(searchParams.get('page')) || 1;
	const listParams: AudioCaptureListParams = {
		page: currentPage,
		countByPage: Number(searchParams.get('countByPage')) || 12,
		firebaseAnonUid: searchParams.get('firebaseAnonUid') || undefined,
		wordLabel: searchParams.get('wordLabel') || undefined,
		labelStatus: (searchParams.get('labelStatus') as LabelStatusEnum) || undefined,
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

			<WaveformEditor ref={waveformRef} audioCaptureId={audioCaptureId} onSegmentSelect={setSelectedSegmentId} />

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
				<SegmentList
					audioCaptureId={audioCaptureId}
					selectedSegmentId={selectedSegmentId}
					onSegmentSelect={setSelectedSegmentId}
					onSegmentPlay={(segmentId) => {
						setSelectedSegmentId(segmentId);
						waveformRef.current?.playSegment(segmentId);
					}}
					onRunVad={() => runVad.mutate()}
					isVadPending={runVad.isPending}
				/>
				<LabelPanel />
			</div>

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
