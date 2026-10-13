'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import type { SessionSound } from '@/types/apis/sessions';

import type { AudioPlaylist } from '@/hooks/use-audio-playlist';

import { cn } from '@/lib/utils';

import { Play, Siren } from 'lucide-react';

import ColorTag from '@/app/(main)/(backoffice)/_components/color-tag';
import SegmentedControl from '@/app/(main)/(backoffice)/_components/segmented-control';
import SoundDownloadButton from '@/app/(main)/(backoffice)/_components/sound-download-button';
import SessionSoundScore from '@/app/(main)/(backoffice)/users/[id]/_components/session-sound-score';
import { SECOND } from '@/config/units';
import { formatAudioDuration } from '@/utils/audio';
import {
	formatCompactDateTime,
	formatShortDate,
	formatShortDateTimeWithSeconds,
	formatTimeWithSeconds,
} from '@/utils/date';

import { Badge } from '@/components/ui/badge';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const SOUND_SORTS = [
	{ sort: 'captured_at', label: '시각순' },
	{ sort: 'judgment', label: '모사 점수순' },
	{ sort: 'analysis', label: '앵무새 소리 점수순' },
] as const;

const headClassName =
	'sticky top-0 z-10 h-9 bg-card text-muted-foreground shadow-[inset_0_-1px_var(--border)] max-md:px-1';

interface Props {
	sounds: SessionSound[];
	emergencySoundIds: ReadonlySet<string>;
	judging: boolean;
	player: AudioPlaylist;
}

/**
 * 세션의 소리를 점수와 함께 나열한 표 컴포넌트
 * @param sounds 시각 순서의 소리 목록
 * @param emergencySoundIds 응급 상황으로 감지된 소리 ID
 * @param judging 모사 판정이 끝나지 않았는지 여부
 * @param player useAudioPlaylist 결과
 */
const SessionSoundTable = ({ sounds, emergencySoundIds, judging, player }: Props) => {
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const selectedRowRef = useRef<HTMLTableRowElement>(null);

	const [sort, setSort] = useState<(typeof SOUND_SORTS)[number]['sort']>('captured_at');

	// 점수가 없는 소리는 맨 뒤
	const sortedSounds =
		sort === 'captured_at' ? sounds : sounds.toSorted((a, b) => (b[sort]?.score ?? -1) - (a[sort]?.score ?? -1));

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
		<section className="grid gap-3">
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

			{/*정해진 높이를 넘으면 표 안에서 스크롤*/}
			<div
				ref={scrollAreaRef}
				className="relative -mr-2 max-h-93 [scrollbar-width:thin] overflow-auto overscroll-contain pr-2"
			>
				<table className="w-full text-sm">
					<TableHeader className="[&_tr]:border-0">
						<TableRow className="hover:bg-transparent">
							<TableHead className={cn(headClassName, 'w-10 pl-1.5')} />
							<TableHead className={headClassName}>시각</TableHead>
							<TableHead className={cn(headClassName, 'max-md:hidden')}>길이</TableHead>
							<TableHead className={headClassName}>앵무새 소리</TableHead>
							<TableHead className={headClassName}>모사</TableHead>
							<TableHead className={headClassName} />
							<TableHead className={cn(headClassName, 'w-11')} />
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
										'cursor-pointer hover:bg-muted [&>td]:py-1.5 max-md:[&>td]:px-1',
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
										<span className="mr-1.5 font-normal text-muted-foreground">
											{formatShortDate(sound.captured_at)}
										</span>
										{formatTimeWithSeconds(sound.captured_at)}
									</TableCell>
									<TableCell className="whitespace-nowrap text-muted-foreground tabular-nums max-md:hidden">
										{sound.duration_ms ? formatAudioDuration(sound.duration_ms / SECOND) : '-'}
									</TableCell>
									<TableCell>
										<SessionSoundScore
											score={sound.analysis?.score ?? null}
											barClassName="bg-chart-1"
											trackClassName="w-18 max-md:hidden"
										/>
									</TableCell>
									<TableCell>
										<SessionSoundScore
											score={sound.judgment?.score ?? null}
											judging={judging}
											barClassName="bg-foreground"
											trackClassName="w-18 max-md:hidden"
										/>
									</TableCell>
									<TableCell>
										<div className="flex justify-end gap-1">
											{/*좁은 화면에서는 태그의 글자를 숨김*/}
											{sound.is_mimic && (
												<ColorTag color="var(--foreground)">
													<span className="max-md:sr-only">모사 성공</span>
												</ColorTag>
											)}
											{emergencySoundIds.has(sound.id) && (
												<Badge
													variant="destructive"
													className="max-md:pr-1.5 dark:bg-destructive/10"
												>
													<Siren data-icon="inline-start" />
													<span className="max-md:sr-only">응급 상황</span>
												</Badge>
											)}
										</div>
									</TableCell>
									{/*다운로드를 눌러도 행의 소리를 재생하지 않음*/}
									<TableCell className="pr-1.5" onClick={(event) => event.stopPropagation()}>
										<SoundDownloadButton
											sounds={[sound]}
											fileName={`sound-${formatCompactDateTime(sound.captured_at)}.wav`}
											label={`${soundTime} 소리 다운로드`}
											iconOnly
										/>
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
