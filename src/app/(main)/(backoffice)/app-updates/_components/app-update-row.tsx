'use client';

import { type FocusEvent, type MouseEvent, useRef, useState } from 'react';

import type { AppUpdate } from '@/types/apis/app-updates';

import { cn } from '@/lib/utils';

import { Check, ChevronRight, X } from 'lucide-react';

import { formatRelativeTime, formatShortDateTime } from '@/utils/date';
import { koreanOrEnglishText } from '@/utils/i18n-text';

export const appUpdateGridClassName =
	'grid grid-cols-[auto_minmax(0,1fr)_auto_14px] items-center gap-x-3 [grid-template-areas:"ver_forced_when_go"_"notes_notes_notes_notes"] md:grid-cols-[minmax(0,1.5fr)_minmax(0,6fr)_minmax(0,0.8fr)_minmax(104px,1.4fr)_34px] md:gap-x-5 md:[grid-template-areas:"ver_notes_forced_when_go"]';

interface Props {
	appUpdate: AppUpdate;
	now: number;
	onOpen: () => void;
}

/**
 * 업데이트 내역의 행 컴포넌트
 * @param appUpdate 표시할 업데이트
 * @param now 서버가 화면을 그린 시각
 * @param onOpen 행을 누르면 실행할 함수
 */
const AppUpdateRow = ({ appUpdate, now, onOpen }: Props) => {
	const releaseNotesRef = useRef<HTMLSpanElement>(null);

	const [releaseNotesTooltipVisible, setReleaseNotesTooltipVisible] = useState(false);

	const releaseNotes = appUpdate.release_notes ? koreanOrEnglishText(appUpdate.release_notes).trim() : '';

	/** 출시 노트가 말줄임됐는지 확인하는 함수 */
	const releaseNotesTruncated = () => {
		const releaseNotesElement = releaseNotesRef.current;

		return !!releaseNotesElement && releaseNotesElement.scrollWidth > releaseNotesElement.clientWidth;
	};

	// 버튼이 행을 덮어 위치로 확인
	const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
		const releaseNotesRect = releaseNotesRef.current?.getBoundingClientRect();
		const releaseNotesPointed =
			!!releaseNotesRect &&
			event.clientX >= releaseNotesRect.left &&
			event.clientX <= releaseNotesRect.right &&
			event.clientY >= releaseNotesRect.top &&
			event.clientY <= releaseNotesRect.bottom;

		setReleaseNotesTooltipVisible(releaseNotesPointed && releaseNotesTruncated());
	};

	const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
		setReleaseNotesTooltipVisible(event.currentTarget.matches(':focus-visible') && releaseNotesTruncated());
	};

	return (
		<li
			className={cn(
				appUpdateGridClassName,
				'relative -mx-2 rounded-md px-2 py-2.5 tabular-nums transition-colors before:absolute before:inset-x-2 before:top-0 before:border-t before:border-border hover:bg-muted max-md:gap-y-3 max-md:first:before:hidden',
			)}
		>
			{/*누르는 영역을 행 전체로 넓힌 버튼*/}
			<button
				type="button"
				aria-label={`${appUpdate.version} 편집`}
				className="text-left font-bold [grid-area:ver] after:absolute after:inset-0 after:rounded-md focus-visible:outline-0 focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand"
				onClick={onOpen}
				onMouseMove={handleMouseMove}
				onMouseLeave={() => setReleaseNotesTooltipVisible(false)}
				onFocus={handleFocus}
				onBlur={() => setReleaseNotesTooltipVisible(false)}
			>
				{appUpdate.version}
			</button>

			<div className="pointer-events-none relative min-w-0 [grid-area:notes]">
				<span ref={releaseNotesRef} className="block truncate text-muted-foreground">
					{releaseNotes ? releaseNotes.replaceAll('\n', ' ') : '없음'}
				</span>

				{releaseNotesTooltipVisible && (
					<span
						role="tooltip"
						className="absolute bottom-[calc(100%+8px)] -left-3 z-10 grid w-max max-w-90 animate-in gap-0.5 rounded-lg bg-tooltip px-3 py-2 text-[13px] text-tooltip-foreground shadow-[0_10px_24px_-8px_rgb(0_0_0/0.4)] duration-120 fade-in-0 max-md:hidden"
					>
						{releaseNotes.split('\n').map((line, index) => (
							<span key={`${index}-${line}`}>{line}</span>
						))}
					</span>
				)}
			</div>

			<span className="flex items-center gap-1 [grid-area:forced] max-md:before:text-[12.5px] max-md:before:font-semibold max-md:before:text-muted-foreground max-md:before:content-['강제']">
				{appUpdate.is_forced ? (
					<Check aria-label="강제 업데이트" strokeWidth={2.25} className="size-4 text-success">
						<title>강제 업데이트</title>
					</Check>
				) : (
					<X aria-label="선택 업데이트" strokeWidth={2.25} className="size-4 text-destructive">
						<title>선택 업데이트</title>
					</X>
				)}
			</span>

			<p className="whitespace-nowrap text-muted-foreground [grid-area:when]">
				{formatShortDateTime(appUpdate.created_at)}
				<small className="block text-[12.5px] max-md:hidden">
					{formatRelativeTime(appUpdate.created_at, now)}
				</small>
			</p>

			<ChevronRight aria-hidden className="size-3.5 text-muted-foreground [grid-area:go]" />
		</li>
	);
};

export default AppUpdateRow;
