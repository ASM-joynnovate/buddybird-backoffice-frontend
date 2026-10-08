'use client';

import { type PointerEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';

import type { Session } from '@/types/apis/sessions';

import { useGetSessionEventList, useGetSessionSoundList } from '@/hooks/apis/sessions';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';

import StatCell from '@/app/(main)/(backoffice)/_components/stat-cell';
import SessionTrack from '@/app/(main)/(backoffice)/users/[id]/_components/session-track';
import { TIMELINE_MAX_SOUND_BAR_COUNT, TIMELINE_MIN_VISIBLE_MS } from '@/config';
import { SESSION_EVENTS } from '@/config/session';
import { HOUR } from '@/config/units';
import { formatMonthDayTime, formatShortDateTime, toHoursAndMinutes } from '@/utils/date';
import { type TimePeriod, toPeriodPercent } from '@/utils/session';

const zoomOptions = [
	{ label: '전체', visibleMs: null },
	{ label: '6시간', visibleMs: 6 * HOUR },
	{ label: '1시간', visibleMs: HOUR },
];
const legends = [
	{ label: '세션', className: 'bg-[color-mix(in_srgb,var(--chart-1)_46%,var(--card))]' },
	{ label: '수면 시간', className: 'bg-[color-mix(in_srgb,var(--chart-4)_46%,var(--card))]' },
	{ label: '연결 끊김', className: 'bg-destructive-dot' },
	{ label: '따라 함', className: 'bg-foreground' },
];
const laneLabelClassName = 'sticky left-0 -mb-2 w-max text-[12.5px] text-muted-foreground';

interface Props {
	session: Session;
	sessionPeriod: TimePeriod;
	timeZone: string;
}

/**
 * 세션 하나의 타임라인 컴포넌트
 * @param session 표시할 세션
 * @param sessionPeriod 세션의 시작 및 끝 시각
 * @param timeZone 스테이션 기기의 시간대
 */
const SessionTimeline = ({ session, sessionPeriod, timeZone }: Props) => {
	const { data: sessionEventListData } = useGetSessionEventList({ id: session.id });

	const { data: sessionSoundListData } = useGetSessionSoundList({ id: session.id });

	const viewRef = useRef<HTMLDivElement>(null);
	const zoomAnchorRef = useRef({ contentRatio: 0, viewOffset: 0 });
	const dragRef = useRef<{ clientX: number; scrollLeft: number } | null>(null);

	const [zoom, setZoom] = useState(1);
	const [visibleRange, setVisibleRange] = useState({ leftPercent: 0, widthPercent: 100 });
	const [hoveredPercent, setHoveredPercent] = useState<number | null>(null);
	const [highlightedEventId, setHighlightedEventId] = useState<string | null>(null);

	const durationMs = sessionPeriod.endMs - sessionPeriod.startMs;
	const duration = toHoursAndMinutes(durationMs);
	const maxZoom = Math.max(1, durationMs / TIMELINE_MIN_VISIBLE_MS);

	const sessionEvents = sessionEventListData.map((sessionEvent) => {
		const heartbeatExpired =
			sessionEvent.kind === 'session_finished' && session.period.ended_reason === 'heartbeat_expired';
		const learningLabel =
			sessionEvent.is_learning === null ? null : sessionEvent.is_learning ? '학습 On' : '학습 Off';

		return {
			id: sessionEvent.id,
			occurredAt: sessionEvent.occurred_at,
			percent: toPeriodPercent(dayjs(sessionEvent.occurred_at).valueOf(), sessionPeriod),
			label: heartbeatExpired ? '신호 끊김으로 종료' : (learningLabel ?? SESSION_EVENTS[sessionEvent.kind].label),
			wordName: sessionEvent.word?.name,
			color: heartbeatExpired ? 'var(--destructive-dot)' : SESSION_EVENTS[sessionEvent.kind].color,
		};
	});

	// 확대 배율에 맞춘 시간 구간별 소리 수
	const soundBarCount = Math.round(Math.min(TIMELINE_MAX_SOUND_BAR_COUNT, 80 * zoom));
	const soundCounts = Array.from({ length: soundBarCount }, () => 0);

	for (const sessionSound of sessionSoundListData) {
		const percent = toPeriodPercent(dayjs(sessionSound.captured_at).valueOf(), sessionPeriod);

		soundCounts[Math.min(soundBarCount - 1, Math.floor((percent / 100) * soundBarCount))] += 1;
	}

	const maxSoundCount = Math.max(1, ...soundCounts);
	const tickCount = Math.round(Math.min(60, 5 * zoom));

	/** 미니맵에 표시할 현재 보이는 범위 갱신 */
	const updateVisibleRange = () => {
		const view = viewRef.current;

		if (!view) {
			return;
		}

		setVisibleRange({
			leftPercent: (view.scrollLeft / view.scrollWidth) * 100,
			widthPercent: (view.clientWidth / view.scrollWidth) * 100,
		});
	};

	/** 화면의 한 지점을 고정한 채 확대 배율 변경 */
	const changeZoom = (toNextZoom: (currentZoom: number) => number, viewOffset: number) => {
		const view = viewRef.current;

		if (!view) {
			return;
		}

		zoomAnchorRef.current = {
			contentRatio: (view.scrollLeft + view.clientWidth * viewOffset) / view.scrollWidth,
			viewOffset,
		};

		setZoom((prev) => Math.min(maxZoom, Math.max(1, toNextZoom(prev))));
	};

	/** 확대한 뒤 고정한 지점으로 스크롤 */
	useLayoutEffect(() => {
		const view = viewRef.current;

		if (!view) {
			return;
		}

		const { contentRatio, viewOffset } = zoomAnchorRef.current;

		view.scrollLeft = contentRatio * view.scrollWidth - view.clientWidth * viewOffset;

		updateVisibleRange();
	}, [zoom]);

	/** Ctrl + 스크롤로 확대 */
	useEffect(() => {
		const view = viewRef.current;

		if (!view) {
			return;
		}

		const handleWheel = (event: WheelEvent) => {
			if (!event.ctrlKey && !event.metaKey) {
				return;
			}

			event.preventDefault();

			const viewRect = view.getBoundingClientRect();

			changeZoom(
				(currentZoom) => currentZoom * Math.exp(-event.deltaY * 0.01),
				(event.clientX - viewRect.left) / viewRect.width,
			);
		};

		view.addEventListener('wheel', handleWheel, { passive: false });

		return () => view.removeEventListener('wheel', handleWheel);
	});

	const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
		if (event.pointerType !== 'touch' && !(event.target instanceof HTMLButtonElement)) {
			dragRef.current = { clientX: event.clientX, scrollLeft: event.currentTarget.scrollLeft };
		}
	};

	const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
		const view = event.currentTarget;
		const viewRect = view.getBoundingClientRect();

		setHoveredPercent(((event.clientX - viewRect.left + view.scrollLeft) / view.scrollWidth) * 100);

		if (dragRef.current) {
			view.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.clientX);
		}
	};

	const handleSeek = (event: PointerEvent<HTMLDivElement>) => {
		const view = viewRef.current;

		if (!view || event.buttons === 0) {
			return;
		}

		const minimapRect = event.currentTarget.getBoundingClientRect();

		view.scrollLeft =
			((event.clientX - minimapRect.left) / minimapRect.width) * view.scrollWidth - view.clientWidth / 2;
	};

	const handleShowEvent = (percent: number) => {
		const view = viewRef.current;

		view?.scrollTo({ left: (percent / 100) * view.scrollWidth - view.clientWidth / 2, behavior: 'smooth' });
	};

	return (
		<div className="grid min-w-0 content-start gap-4 p-4 md:px-5.5 md:py-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h3 className="text-base font-bold">{formatMonthDayTime(session.period.started_at)} 세션</h3>

				<div className="inline-flex h-7 rounded-md bg-muted p-0.5">
					{zoomOptions.map((zoomOption) => {
						const optionZoom = zoomOption.visibleMs ? durationMs / zoomOption.visibleMs : 1;

						return (
							<button
								key={zoomOption.label}
								type="button"
								disabled={!!zoomOption.visibleMs && optionZoom <= 1}
								aria-pressed={Math.abs(zoom - optionZoom) < 0.01}
								className="rounded-sm px-2.5 text-[13px] font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40 aria-pressed:bg-foreground aria-pressed:text-card"
								onClick={() => changeZoom(() => optionZoom, 0.5)}
							>
								{zoomOption.label}
							</button>
						);
					})}
				</div>
			</div>

			<dl className="grid grid-cols-2 gap-2 md:grid-cols-4">
				<StatCell label="길이">
					{duration.hours}시간 {duration.minutes}분
				</StatCell>
				<StatCell label="단어">{session.word.name}</StatCell>
				<StatCell label="앵무새 소리">{session.sounds.parrot_count}회</StatCell>
				<StatCell label="따라 한 횟수">{session.sounds.mimicry_count}회</StatCell>
			</dl>

			<div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-muted-foreground">
				{legends.map((legend) => (
					<span key={legend.label} className="inline-flex items-center gap-1.5">
						<span className={cn('size-2 rounded-full', legend.className)} />
						{legend.label}
					</span>
				))}
				<span className="ml-auto text-[12.5px] max-md:hidden">드래그해 이동, Ctrl + 스크롤로 확대</span>
			</div>

			{/*확대 및 이동할 수 있는 타임라인*/}
			<div
				ref={viewRef}
				className="cursor-grab touch-pan-x [scrollbar-width:none] overflow-x-auto pt-3.5 pb-1 active:cursor-grabbing"
				onScroll={updateVisibleRange}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={() => {
					dragRef.current = null;
				}}
				onPointerLeave={() => {
					dragRef.current = null;

					setHoveredPercent(null);
				}}
			>
				<div className="relative" style={{ width: `${zoom * 100}%` }}>
					<div className="grid gap-3.5 px-1.5 select-none">
						<p className={laneLabelClassName}>진행 및 이벤트</p>
						<SessionTrack
							session={session}
							sessionPeriod={sessionPeriod}
							timeZone={timeZone}
							className="h-4"
						>
							{sessionEvents.map((sessionEvent) => (
								<button
									key={sessionEvent.id}
									type="button"
									aria-label={`${formatShortDateTime(sessionEvent.occurredAt)} ${sessionEvent.label}`}
									className={cn(
										'absolute -inset-y-1.5 -ml-px w-0.5 rounded-full before:absolute before:-top-1 before:-left-1 before:size-2.5 before:rounded-full before:bg-inherit before:ring-2 before:ring-card before:transition-transform after:absolute after:-inset-x-2 after:-inset-y-1.5 hover:before:scale-150',
										highlightedEventId === sessionEvent.id && 'z-10 before:scale-150',
									)}
									style={{ left: `${sessionEvent.percent}%`, backgroundColor: sessionEvent.color }}
									onPointerEnter={() => setHighlightedEventId(sessionEvent.id)}
									onPointerLeave={() => setHighlightedEventId(null)}
								/>
							))}
						</SessionTrack>

						<p className={laneLabelClassName}>앵무새 소리</p>
						<div aria-hidden className="flex h-10 items-end gap-px">
							{soundCounts.map((soundCount, index) => (
								<span
									key={index}
									className="min-w-0 flex-1 rounded-t-xs bg-chart-1/70"
									style={{ height: `${(soundCount / maxSoundCount) * 100}%` }}
								/>
							))}
						</div>

						<p className={laneLabelClassName}>따라 함</p>
						<div aria-hidden className="relative h-2.5">
							{sessionSoundListData
								.filter((sessionSound) => sessionSound.is_mimicry)
								.map((sessionSound) => (
									<span
										key={sessionSound.captured_at}
										className="absolute top-px -ml-1 size-2 rounded-full bg-foreground"
										style={{
											left: `${toPeriodPercent(dayjs(sessionSound.captured_at).valueOf(), sessionPeriod)}%`,
										}}
									/>
								))}
						</div>

						<ol className="flex justify-between text-[11.5px] whitespace-nowrap text-muted-foreground tabular-nums">
							{Array.from({ length: tickCount + 1 }, (_, index) => (
								<li key={index}>
									{formatShortDateTime(sessionPeriod.startMs + (durationMs * index) / tickCount)}
								</li>
							))}
						</ol>
					</div>

					{/*마우스가 가리키는 시각*/}
					{hoveredPercent !== null && (
						<div
							className="pointer-events-none absolute top-0 bottom-4.5 w-px bg-chart-neutral"
							style={{ left: `${hoveredPercent}%` }}
						>
							<span className="absolute -top-3 left-1.5 rounded-sm bg-tooltip px-1.5 py-px text-[11.5px] font-semibold whitespace-nowrap text-tooltip-foreground tabular-nums">
								{formatShortDateTime(sessionPeriod.startMs + (durationMs * hoveredPercent) / 100)}
							</span>
						</div>
					)}
				</div>
			</div>

			{/*전체 구간 및 현재 보이는 범위*/}
			<div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 text-[12.5px] text-muted-foreground">
				전체 구간
				<div
					className="relative grid h-4.5 cursor-pointer touch-none items-center"
					onPointerDown={handleSeek}
					onPointerMove={handleSeek}
				>
					<SessionTrack
						session={session}
						sessionPeriod={sessionPeriod}
						timeZone={timeZone}
						className="h-1.5"
					/>
					<span
						className="pointer-events-none absolute inset-y-0 rounded-sm bg-foreground/6 ring-2 ring-foreground ring-inset"
						style={{ left: `${visibleRange.leftPercent}%`, width: `${visibleRange.widthPercent}%` }}
					/>
				</div>
			</div>

			{/*이벤트 목록, 누르면 그 시점으로 이동*/}
			<div className="flex flex-wrap gap-1.5">
				{sessionEvents.map((sessionEvent) => (
					<button
						key={sessionEvent.id}
						type="button"
						className={cn(
							'inline-flex h-7 items-center gap-2 rounded-md border bg-card px-2.5 text-[13px] font-semibold hover:bg-muted',
							highlightedEventId === sessionEvent.id && 'bg-muted',
						)}
						onClick={() => handleShowEvent(sessionEvent.percent)}
						onPointerEnter={() => setHighlightedEventId(sessionEvent.id)}
						onPointerLeave={() => setHighlightedEventId(null)}
					>
						<span className="size-2 rounded-full" style={{ backgroundColor: sessionEvent.color }} />
						<time className="font-normal text-muted-foreground tabular-nums">
							{formatShortDateTime(sessionEvent.occurredAt)}
						</time>
						{sessionEvent.label}
						{!!sessionEvent.wordName && ` ${sessionEvent.wordName}`}
					</button>
				))}
			</div>
		</div>
	);
};

export default SessionTimeline;
