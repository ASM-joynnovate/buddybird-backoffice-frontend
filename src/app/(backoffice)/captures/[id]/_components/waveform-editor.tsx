'use client';

import { useCallback, useEffect, useImperativeHandle, useRef } from 'react';

import { useGetAudioCaptureDetail } from '@/hooks/apis/use-audio-captures';
import { useCreateAudioSegment, useTrimAudioSegment } from '@/hooks/apis/use-audio-segments';

import { downloadFile } from '@/lib/utils';

import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin, { Region } from 'wavesurfer.js/dist/plugins/regions.js';

import { Button } from '@/components/ui/button';

export interface WaveformEditorHandle {
	playSegment: (segmentId: string) => void;
}

interface WaveformEditorProps {
	audioCaptureId: string;
	highlightedSegmentId: string | null;
	onSegmentHover: (segmentId: string | null) => void;
	ref?: React.Ref<WaveformEditorHandle>;
}

export default function WaveformEditor({
	audioCaptureId,
	highlightedSegmentId,
	onSegmentHover,
	ref,
}: WaveformEditorProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const wavesurferRef = useRef<WaveSurfer | null>(null);
	const regionsRef = useRef<RegionsPlugin | null>(null);
	const highlightedIdRef = useRef<string | null>(null);

	const { data: capture } = useGetAudioCaptureDetail(audioCaptureId);
	const createSegment = useCreateAudioSegment(audioCaptureId);
	const trimSegment = useTrimAudioSegment(audioCaptureId);

	useImperativeHandle(
		ref,
		() => ({
			playSegment: async (segmentId: string) => {
				const ws = wavesurferRef.current;
				const segment = capture.segments.find((s) => s.id === segmentId);
				if (!ws || !segment) return;

				const mediaElement = ws.getMediaElement();
				if (mediaElement.paused) await mediaElement.play().catch(() => {});
				mediaElement.pause();

				ws.setTime(segment.startMs / 1000);
				ws.play();

				const handleTimeUpdate = (currentTime: number) => {
					if (currentTime >= segment.endMs / 1000) {
						ws.pause();
						ws.un('timeupdate', handleTimeUpdate);
					}
				};
				ws.on('timeupdate', handleTimeUpdate);
			},
		}),
		[capture.segments],
	);

	const addRegions = useCallback(() => {
		const regions = regionsRef.current;
		if (!regions) return;

		regions.clearRegions();
		capture.segments.forEach((seg) => {
			const isHighlighted = seg.id === highlightedIdRef.current;
			const region = regions.addRegion({
				id: seg.id,
				start: seg.startMs / 1000,
				end: seg.endMs / 1000,
				color: isHighlighted ? 'rgba(37, 99, 235, 0.4)' : 'rgba(37, 99, 235, 0.2)',
				drag: true,
				resize: true,
			});
			if (region.element) {
				if (isHighlighted) {
					region.element.style.outline = '2px solid rgba(37, 99, 235, 0.6)';
				}
				region.element.addEventListener('mouseenter', () => onSegmentHover(seg.id));
				region.element.addEventListener('mouseleave', () => onSegmentHover(null));
			}
			region.element?.querySelectorAll<HTMLElement>('[part*="region-handle"]').forEach((el) => {
				el.style.width = '12px';
				el.style.backgroundColor = 'rgba(37, 99, 235, 0.35)';
			});
		});
	}, [capture.segments, onSegmentHover]);

	useEffect(() => {
		if (!containerRef.current) return;

		const regions = RegionsPlugin.create();
		const ws = WaveSurfer.create({
			container: containerRef.current,
			waveColor: '#a3a3a3',
			progressColor: '#525252',
			height: 120,
			barWidth: 2,
			barGap: 1,
			barRadius: 1,
			plugins: [regions],
		});

		wavesurferRef.current = ws;
		regionsRef.current = regions;

		ws.on('ready', () => {
			addRegions();
			regions.enableDragSelection(
				{
					color: 'rgba(37, 99, 235, 0.2)',
					drag: true,
					resize: true,
				},
				5,
			);
		});
		ws.load(capture.audioUrl).catch(() => {});

		return () => {
			ws.destroy();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [capture.audioUrl]);

	useEffect(() => {
		const regions = regionsRef.current;
		if (!regions) return;

		addRegions();

		const handleRegionUpdate = (region: Region) => {
			trimSegment.mutate({
				audioSegmentId: region.id,
				data: { startMs: Math.round(region.start * 1000), endMs: Math.round(region.end * 1000) },
			});
		};

		const handleRegionCreated = (region: Region) => {
			if (capture.segments.some((s) => s.id === region.id)) return;
			if (region.end - region.start < 0.05) {
				region.remove();
				return;
			}
			createSegment.mutate(
				{ startMs: Math.round(region.start * 1000), endMs: Math.round(region.end * 1000) },
				{ onError: () => region.remove() },
			);
		};

		regions.on('region-updated', handleRegionUpdate);
		regions.on('region-created', handleRegionCreated);

		return () => {
			regions.un('region-updated', handleRegionUpdate);
			regions.un('region-created', handleRegionCreated);
		};
	}, [trimSegment, createSegment, capture.segments]);

	useEffect(() => {
		highlightedIdRef.current = highlightedSegmentId;
		const regions = regionsRef.current;
		if (!regions) return;
		for (const region of regions.getRegions()) {
			if (!region.element) continue;
			const active = region.id === highlightedSegmentId;
			region.setOptions({ color: active ? 'rgba(37, 99, 235, 0.4)' : 'rgba(37, 99, 235, 0.2)' });
			region.element.style.outline = active ? '2px solid rgba(37, 99, 235, 0.6)' : 'none';
		}
	}, [highlightedSegmentId]);

	const handlePlayPause = useCallback(() => {
		wavesurferRef.current?.playPause();
	}, []);

	return (
		<div className="rounded-lg border bg-card p-4">
			<div className="mb-3 flex justify-end gap-2">
				<Button variant="outline" size="sm" onClick={() => downloadFile(capture.audioUrl)}>
					다운로드
				</Button>
				<Button variant="outline" size="sm" onClick={handlePlayPause}>
					재생
				</Button>
			</div>
			<div ref={containerRef} className="touch-action-none rounded-md bg-muted" />
		</div>
	);
}
