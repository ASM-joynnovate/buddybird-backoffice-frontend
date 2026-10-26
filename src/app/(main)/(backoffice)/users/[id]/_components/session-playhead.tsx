'use client';

import { useLayoutEffect, useRef } from 'react';

import type { AudioPlaylist } from '@/hooks/use-audio-playlist';

import { cn } from '@/lib/utils';

import { SECOND } from '@/config/units';
import { type TimePeriod, toPeriodPercent } from '@/utils/session';

interface Props {
	startMs: number;
	sessionPeriod: TimePeriod;
	player: AudioPlaylist;
	className: string;
}

/**
 * 녹음 시각에 재생 시간을 합산한 위치의 세로선 컴포넌트
 * @param startMs 재생할 차례인 소리의 녹음 시각
 * @param sessionPeriod 세션의 시작 및 끝 시각
 * @param player useAudioPlaylist 결과
 * @param className 선의 모양을 정하는 class
 */
const SessionPlayhead = ({ startMs, sessionPeriod, player, className }: Props) => {
	const lineRef = useRef<HTMLSpanElement>(null);

	const { playing, audioProps } = player;

	/** 재생 중 매 프레임, 정지나 막대 폭 변경 시 한 번 선 이동 */
	useLayoutEffect(() => {
		const line = lineRef.current;
		const container = line?.parentElement;

		if (!line || !container) {
			return;
		}

		// left는 픽셀 단위라 끊겨 transform 사용
		const moveLine = () => {
			const elapsedMs = (audioProps.ref.current?.currentTime ?? 0) * SECOND;
			const x =
				(toPeriodPercent(startMs + elapsedMs, sessionPeriod) / 100) * container.getBoundingClientRect().width;

			line.style.transform = `translateX(${x}px)`;
		};

		moveLine();

		let frame = 0;

		if (playing) {
			frame = requestAnimationFrame(function updateLine() {
				moveLine();

				frame = requestAnimationFrame(updateLine);
			});
		}

		const resizeObserver = new ResizeObserver(moveLine);

		resizeObserver.observe(container);

		return () => {
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
		};
	}, [startMs, sessionPeriod, playing, audioProps.ref]);

	return <span ref={lineRef} className={cn('left-0 will-change-transform', className)} />;
};

export default SessionPlayhead;
