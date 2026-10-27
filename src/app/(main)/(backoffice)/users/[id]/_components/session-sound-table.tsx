'use client';

import { type MouseEvent, type ReactNode, useLayoutEffect, useRef, useState } from 'react';

import type { SessionSound } from '@/types/apis/sessions';

import type { AudioPlaylist } from '@/hooks/use-audio-playlist';

import { cn } from '@/lib/utils';

import { ArrowUpDown, BadgeCheck, Play, Siren } from 'lucide-react';

import ColorTag from '@/app/(main)/(backoffice)/_components/color-tag';
import UserReviewIcon from '@/app/(main)/(backoffice)/_components/user-review-icon';
import SessionSoundScore from '@/app/(main)/(backoffice)/users/[id]/_components/session-sound-score';
import { SESSION_SOUND_KINDS } from '@/config/session';
import { SECOND } from '@/config/units';
import { formatAudioDuration } from '@/utils/audio';
import { formatShortDate, formatShortDateTimeWithSeconds, formatTimeWithSeconds } from '@/utils/date';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const SOUND_SORTS = [
	{ sort: 'captured_at', label: '시각순' },
	{ sort: 'final_mimic_score', label: '모사 점수순' },
	{ sort: 'final_parrot_score', label: '앵무새 점수순' },
] as const;

const headClassName =
	'sticky -top-px z-10 h-12 border-r border-b bg-card-inset px-3 text-muted-foreground last:border-r-0';
const cellClassName = 'border-r border-b px-3 py-1.5 last:border-r-0';
const narrowTableHiddenClassName = 'max-md:hidden @min-[760px]:hidden';
const statusHeadClassName = cn(headClassName, 'w-13 text-center');
const statusCellClassName = cn(cellClassName, 'text-center');
const scoreTrackClassName = 'flex-1 max-md:hidden';

interface Props {
	sounds: SessionSound[];
	distressCallSoundIds: ReadonlySet<string>;
	judging: boolean;
	player: AudioPlaylist;
	filterButton: ReactNode;
}

/**
 * 세션의 소리를 점수와 함께 나열한 표 컴포넌트
 * @param sounds 시각 순서의 소리 목록
 * @param distressCallSoundIds 신경질적 짹짹 소리 ID
 * @param judging 모사 판정이 완료되지 않았는지 여부
 * @param player useAudioPlaylist 결과
 * @param filterButton 제목 줄에 표시할 필터 버튼
 */
const SessionSoundTable = ({ sounds, distressCallSoundIds, judging, player, filterButton }: Props) => {
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const selectedRowRef = useRef<HTMLTableRowElement>(null);

	const [sort, setSort] = useState<(typeof SOUND_SORTS)[number]['sort']>('captured_at');

	// 점수가 없는 소리는 맨 뒤
	const sortedSounds = sort === 'captured_at' ? sounds : sounds.toSorted((a, b) => (b[sort] ?? -1) - (a[sort] ?? -1));

	/** 선택한 소리의 행이 가려져 있으면 목록 가운데로 스크롤 */
	useLayoutEffect(() => {
		const scrollArea = scrollAreaRef.current;
		const selectedRow = selectedRowRef.current;

		if (!scrollArea || !selectedRow) {
			return;
		}

		const rowTop = selectedRow.offsetTop;
		const headHeight = scrollArea.querySelector('thead')?.offsetHeight ?? 0;

		if (
			rowTop < scrollArea.scrollTop + headHeight ||
			rowTop + selectedRow.offsetHeight > scrollArea.scrollTop + scrollArea.clientHeight
		) {
			scrollArea.scrollTop = rowTop - scrollArea.clientHeight / 2;
		}
	}, [player.currentSoundId, sort]);

	const handleSortChange = (nextSort: typeof sort | null) => {
		if (nextSort) {
			setSort(nextSort);
		}
	};

	const handlePlaySound = (event: MouseEvent<HTMLButtonElement>, sound: SessionSound) => {
		// 행 클릭으로 재생이 멈추지 않게 함
		event.stopPropagation();

		player.playSound(sound);
	};

	return (
		<section className="flex min-w-0 flex-col gap-3">
			{/*모바일에서 필터 패널의 위치 기준*/}
			<div className="relative flex flex-wrap items-center justify-between gap-3">
				<h4 className="font-bold tabular-nums">소리 {sounds.length.toLocaleString('ko-KR')}개</h4>

				<div className="flex items-center gap-2">
					{filterButton}

					<Select
						items={SOUND_SORTS.map((soundSort) => ({ value: soundSort.sort, label: soundSort.label }))}
						value={sort}
						onValueChange={handleSortChange}
					>
						<SelectTrigger size="sm" aria-label="정렬">
							<ArrowUpDown />
							<SelectValue />
						</SelectTrigger>
						<SelectContent align="end">
							{SOUND_SORTS.map((soundSort) => (
								<SelectItem key={soundSort.sort} value={soundSort.sort}>
									{soundSort.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{sounds.length === 0 && <p className="text-[13px] text-muted-foreground">소리 없음</p>}

			{/*표 옆에 상세가 있으면 상세 높이까지 확장*/}
			{sounds.length > 0 && (
				<div
					ref={scrollAreaRef}
					className="relative isolate max-h-93 [scrollbar-width:thin] overflow-auto overscroll-contain rounded-lg border @min-[760px]:max-h-none @min-[760px]:min-h-93 @min-[760px]:flex-1 @min-[760px]:basis-0"
				>
					<table className="w-full border-separate border-spacing-0 text-sm">
						<TableHeader className="[&_tr]:border-0">
							<TableRow className="hover:bg-transparent">
								<TableHead className={cn(headClassName, 'w-13')} />
								<TableHead className={headClassName}>시각</TableHead>
								<TableHead className={cn(headClassName, 'max-md:hidden')}>길이</TableHead>
								<TableHead className={cn(headClassName, 'w-35 min-w-35 text-xs')}>
									<span className="grid gap-0.5">
										<span className="flex items-center gap-1.5">
											<span className="size-2 rounded-full bg-foreground" />
											앵무새
										</span>
										<span className="flex items-center gap-1.5">
											<span className="size-2 rounded-full bg-chart-1" />
											모사
										</span>
									</span>
								</TableHead>
								<TableHead className={cn(statusHeadClassName, 'w-31 min-w-31')}>결과</TableHead>
								<TableHead className={statusHeadClassName}>응급</TableHead>
								<TableHead className={statusHeadClassName}>리뷰</TableHead>
								<TableHead className={statusHeadClassName}>라벨</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody className="[&_tr:last-child>td]:border-b-0">
							{sortedSounds.map((sound) => {
								const soundTime = formatShortDateTimeWithSeconds(sound.captured_at);
								const selected = sound.id === player.currentSoundId;

								return (
									<TableRow
										key={sound.id}
										ref={selected ? selectedRowRef : undefined}
										className={cn('cursor-pointer hover:bg-muted', selected && 'bg-muted')}
										onClick={() => player.selectSound(sound)}
									>
										<TableCell className={cn(cellClassName, 'p-3')}>
											<button
												type="button"
												aria-label={`${soundTime} 소리 재생`}
												className="grid size-7 place-items-center rounded-full bg-foreground text-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
												onClick={(event) => handlePlaySound(event, sound)}
											>
												<Play className="size-3 fill-current" />
											</button>
										</TableCell>
										<TableCell className={cn(cellClassName, 'font-semibold tabular-nums')}>
											<span
												className={cn(
													'mr-1.5 font-normal text-muted-foreground',
													narrowTableHiddenClassName,
												)}
											>
												{formatShortDate(sound.captured_at)}
											</span>
											{formatTimeWithSeconds(sound.captured_at)}
										</TableCell>
										<TableCell
											className={cn(
												cellClassName,
												'text-muted-foreground tabular-nums max-md:hidden',
											)}
										>
											{sound.duration_ms ? formatAudioDuration(sound.duration_ms / SECOND) : '-'}
										</TableCell>
										<TableCell className={cellClassName}>
											<div className="grid gap-0.5 leading-4.5">
												<SessionSoundScore
													score={sound.final_parrot_score}
													barClassName="bg-foreground"
													trackClassName={scoreTrackClassName}
												/>
												<SessionSoundScore
													score={sound.final_mimic_score}
													judging={judging}
													barClassName="bg-chart-1"
													trackClassName={scoreTrackClassName}
												/>
											</div>
										</TableCell>
										<TableCell className={statusCellClassName}>
											{sound.kind ? (
												<ColorTag color={SESSION_SOUND_KINDS[sound.kind].color}>
													{SESSION_SOUND_KINDS[sound.kind].label}
												</ColorTag>
											) : (
												<span className="text-muted-foreground">-</span>
											)}
										</TableCell>
										<TableCell className={statusCellClassName}>
											{distressCallSoundIds.has(sound.id) && (
												<Siren
													aria-label="응급 상황"
													className="inline size-4 text-destructive-dot"
												>
													<title>응급 상황</title>
												</Siren>
											)}
										</TableCell>
										<TableCell className={statusCellClassName}>
											{!!sound.user_review && (
												<UserReviewIcon
													correct={sound.user_review.is_correct}
													className="inline"
												/>
											)}
										</TableCell>
										<TableCell className={statusCellClassName}>
											{sound.is_labeled && (
												<BadgeCheck
													aria-label="운영자 라벨 있음"
													className="inline size-4 text-info"
												>
													<title>운영자 라벨 있음</title>
												</BadgeCheck>
											)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</table>
				</div>
			)}
		</section>
	);
};

export default SessionSoundTable;
