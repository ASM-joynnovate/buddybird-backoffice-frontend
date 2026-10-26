'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import type { SessionSound } from '@/types/apis/sessions';

import type { AudioPlaylist } from '@/hooks/use-audio-playlist';

import { cn } from '@/lib/utils';

import { BadgeCheck, Play, Siren } from 'lucide-react';

import ColorTag from '@/app/(main)/(backoffice)/_components/color-tag';
import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';
import UserReviewIcon from '@/app/(main)/(backoffice)/_components/user-review-icon';
import SessionSoundScore from '@/app/(main)/(backoffice)/users/[id]/_components/session-sound-score';
import { SESSION_SOUND_KINDS } from '@/config/session';
import { SECOND } from '@/config/units';
import { formatAudioDuration } from '@/utils/audio';
import { formatShortDate, formatShortDateTimeWithSeconds, formatTimeWithSeconds } from '@/utils/date';

import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const SOUND_SORTS = [
	{ sort: 'captured_at', label: '시각순' },
	{ sort: 'final_mimic_score', label: '모사 점수순' },
	{ sort: 'final_parrot_score', label: '앵무새 점수순' },
] as const;

const headClassName =
	'sticky -top-px z-10 h-9 bg-card text-muted-foreground shadow-[inset_0_-1px_var(--border)] max-md:px-1 @min-[760px]:px-1';
const narrowTableHiddenClassName = 'max-md:hidden @min-[760px]:hidden';
const statusHeadClassName = cn(headClassName, 'text-center');

interface Props {
	sounds: SessionSound[];
	distressCallSoundIds: ReadonlySet<string>;
	judging: boolean;
	player: AudioPlaylist;
}

/**
 * 세션의 소리를 점수와 함께 나열한 표 컴포넌트
 * @param sounds 시각 순서의 소리 목록
 * @param distressCallSoundIds 신경질적 짹짹 소리 ID
 * @param judging 모사 판정이 완료되지 않았는지 여부
 * @param player useAudioPlaylist 결과
 */
const SessionSoundTable = ({ sounds, distressCallSoundIds, judging, player }: Props) => {
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

	return (
		<section className="flex min-w-0 flex-col gap-3">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h4 className="font-bold tabular-nums">소리 {sounds.length.toLocaleString('ko-KR')}개</h4>

				<SegmentedControl
					label="정렬"
					size="sm"
					options={SOUND_SORTS.map((soundSort) => ({ value: soundSort.sort, label: soundSort.label }))}
					value={sort}
					className="max-w-full overflow-x-auto border-0 bg-muted"
					onValueChange={setSort}
				/>
			</div>

			{/*표 옆에 상세가 있으면 상세 높이까지 확장*/}
			<div
				ref={scrollAreaRef}
				className="relative -mr-2 max-h-93 [scrollbar-width:thin] overflow-auto overscroll-contain pr-2 @min-[760px]:max-h-none @min-[760px]:min-h-93 @min-[760px]:flex-1 @min-[760px]:basis-0"
			>
				<table className="w-full text-sm">
					<TableHeader className="[&_tr]:border-0">
						<TableRow className="hover:bg-transparent">
							<TableHead className={cn(headClassName, 'w-10 min-w-10 pl-1.5')} />
							<TableHead className={cn(headClassName, 'min-w-18')}>시각</TableHead>
							<TableHead className={cn(headClassName, narrowTableHiddenClassName)}>길이</TableHead>
							<TableHead className={cn(headClassName, 'min-w-12 border-l')}>앵무새</TableHead>
							<TableHead className={cn(headClassName, 'min-w-11')}>모사</TableHead>
							<TableHead className={cn(statusHeadClassName, 'min-w-20 border-l')}>결과</TableHead>
							<TableHead className={cn(statusHeadClassName, 'min-w-10')}>응급</TableHead>
							<TableHead className={cn(statusHeadClassName, 'min-w-19')}>사용자 리뷰</TableHead>
							<TableHead className={cn(statusHeadClassName, 'min-w-10')}>라벨</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{sortedSounds.map((sound) => {
							const soundTime = formatShortDateTimeWithSeconds(sound.captured_at);
							const selected = sound.id === player.currentSoundId;

							return (
								<TableRow
									key={sound.id}
									ref={selected ? selectedRowRef : undefined}
									className={cn(
										'cursor-pointer hover:bg-muted [&>td]:py-1.5 max-md:[&>td]:px-1 @min-[760px]:[&>td]:px-1',
										selected && 'bg-muted',
									)}
									onClick={() => player.playSound(sound)}
								>
									<TableCell className="pl-1.5">
										<button
											type="button"
											aria-label={`${soundTime} 소리 재생`}
											className="grid size-7 place-items-center rounded-full bg-foreground text-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
										>
											<Play className="size-3 fill-current" />
										</button>
									</TableCell>
									<TableCell className="font-semibold whitespace-nowrap tabular-nums">
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
											'whitespace-nowrap text-muted-foreground tabular-nums',
											narrowTableHiddenClassName,
										)}
									>
										{sound.duration_ms ? formatAudioDuration(sound.duration_ms / SECOND) : '-'}
									</TableCell>
									<TableCell className="border-l">
										<SessionSoundScore
											score={sound.final_parrot_score}
											barClassName="bg-chart-1"
											trackClassName={cn('w-18', narrowTableHiddenClassName)}
										/>
									</TableCell>
									<TableCell>
										<SessionSoundScore
											score={sound.final_mimic_score}
											judging={judging}
											barClassName="bg-foreground"
											trackClassName={cn('w-18', narrowTableHiddenClassName)}
										/>
									</TableCell>
									<TableCell className="border-l text-center">
										{sound.kind ? (
											<ColorTag color={SESSION_SOUND_KINDS[sound.kind].color}>
												{SESSION_SOUND_KINDS[sound.kind].label}
											</ColorTag>
										) : (
											<span className="text-muted-foreground">-</span>
										)}
									</TableCell>
									<TableCell className="text-center">
										{distressCallSoundIds.has(sound.id) && (
											<Siren
												aria-label="응급 상황"
												className="inline size-4 text-destructive-dot"
											>
												<title>응급 상황</title>
											</Siren>
										)}
									</TableCell>
									<TableCell className="text-center">
										{!!sound.user_review && (
											<UserReviewIcon correct={sound.user_review.is_correct} className="inline" />
										)}
									</TableCell>
									<TableCell className="text-center">
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
		</section>
	);
};

export default SessionSoundTable;
