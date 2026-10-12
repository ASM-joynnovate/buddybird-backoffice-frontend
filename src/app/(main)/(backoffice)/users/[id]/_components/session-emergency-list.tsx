'use client';

import type { SessionSound } from '@/types/apis/sessions';

import type { AudioPlaylist } from '@/hooks/use-audio-playlist';

import { cn } from '@/lib/utils';

import { Play, Siren, Square } from 'lucide-react';

import SessionSoundDownloadButton from '@/app/(main)/(backoffice)/users/[id]/_components/session-sound-download-button';
import { SECOND } from '@/config/units';
import { formatAudioDuration } from '@/utils/audio';
import {
	formatCompactDateTime,
	formatShortDate,
	formatShortDateTimeWithSeconds,
	formatTimeWithSeconds,
} from '@/utils/date';

import { Button } from '@/components/ui/button';

const SHORTEST_SOUND_WIDTH_PX = 72;

/** 재생 중인 소리 칸이 가려져 있으면 보이는 곳으로 스크롤하는 함수 */
const showSoundCell = (soundCell: HTMLButtonElement | null) => {
	const soundCells = soundCell?.parentElement;

	if (!soundCell || !soundCells) {
		return;
	}

	if (
		soundCell.offsetLeft < soundCells.scrollLeft ||
		soundCell.offsetLeft + soundCell.offsetWidth > soundCells.scrollLeft + soundCells.clientWidth
	) {
		soundCells.scrollLeft = soundCell.offsetLeft - 8;
	}
};

export interface Emergency {
	id: string;
	sounds: SessionSound[];
}

interface Props {
	emergencies: Emergency[];
	player: AudioPlaylist;
	onScoreTooltipShow: (anchor: Element, sounds: SessionSound[]) => void;
	onScoreTooltipHide: () => void;
}

/**
 * 응급 상황마다 감지된 소리를 한 줄에 나열한 목록 컴포넌트
 * @param emergencies 응급 상황 및 감지된 소리 목록
 * @param player useAudioPlaylist 결과
 * @param onScoreTooltipShow 소리 칸을 가리키면 실행할 함수
 * @param onScoreTooltipHide 소리 칸에서 벗어나면 실행할 함수
 */
const SessionEmergencyList = ({ emergencies, player, onScoreTooltipShow, onScoreTooltipHide }: Props) => {
	return (
		<section className="rounded-lg bg-[color-mix(in_srgb,var(--destructive)_6%,var(--card))] px-3.5 py-3 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--destructive)_24%,transparent)]">
			<div className="mb-1.5 flex items-baseline justify-between gap-3">
				<h4 className="inline-flex items-center gap-1.5 font-bold">
					<Siren className="size-4 self-center text-destructive-dot" strokeWidth={2} />
					응급 상황
				</h4>
				<span className="text-[13px] text-muted-foreground tabular-nums">{emergencies.length}번</span>
			</div>

			{/*응급 상황 세 번까지 보이고 넘으면 스크롤*/}
			<ul className="-mr-2 max-h-33.5 [scrollbar-width:thin] divide-y divide-destructive/16 overflow-y-auto overscroll-contain pr-2 max-md:max-h-57.5">
				{emergencies.map((emergency) => {
					const firstSoundTime = formatShortDateTimeWithSeconds(emergency.sounds[0].captured_at);
					const groupPlaying = player.playingSoundGroupId === emergency.id;

					const durations = emergency.sounds.flatMap((sound) => sound.duration_ms ?? []);
					const durationsKnown = durations.length === emergency.sounds.length;
					const shortestDurationMs = Math.min(...durations);
					const totalDurationMs = durations.reduce((total, durationMs) => total + durationMs, 0);

					return (
						<li
							key={emergency.id}
							className="grid h-11 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 tabular-nums max-md:h-auto max-md:grid-cols-[minmax(0,1fr)_auto] max-md:gap-x-2 max-md:gap-y-1.5 max-md:py-2"
						>
							{/*시각, 소리 개수, 길이의 합을 한 묶음으로 표시*/}
							<div className="grid gap-0.5 border-r border-destructive/16 pr-3 leading-tight whitespace-nowrap max-md:border-r-0 max-md:pr-0">
								<p className="flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
									{formatShortDate(emergency.sounds[0].captured_at)}
									<span className="flex gap-2">
										<strong className="font-semibold text-foreground">
											{emergency.sounds.length}개
										</strong>
										{totalDurationMs > 0 ? formatAudioDuration(totalDurationMs / SECOND) : '-'}
									</span>
								</p>
								<time className="font-semibold">
									{formatTimeWithSeconds(emergency.sounds[0].captured_at)} ~{' '}
									{formatTimeWithSeconds(emergency.sounds.at(-1)?.captured_at)}
								</time>
							</div>

							{/*가장 짧은 소리를 기준으로 길이에 비례한 칸*/}
							<fieldset className="relative flex h-7 min-w-0 [scrollbar-width:none] gap-0.5 overflow-x-auto overscroll-contain max-md:col-span-2 max-md:row-start-2">
								<legend className="sr-only">{firstSoundTime} 응급 상황으로 감지된 소리</legend>

								{emergency.sounds.map((sound) => {
									const selected = sound.id === player.currentSoundId;
									const soundWeight =
										durationsKnown && sound.duration_ms
											? sound.duration_ms / shortestDurationMs
											: 1;

									return (
										<button
											key={sound.id}
											ref={selected && groupPlaying ? showSoundCell : undefined}
											type="button"
											aria-label={`${formatShortDateTimeWithSeconds(sound.captured_at)} 소리 재생`}
											className={cn(
												'@container relative flex min-w-0 items-center justify-between gap-2 overflow-hidden rounded-sm bg-[color-mix(in_srgb,var(--destructive-dot)_20%,var(--card))] px-2 text-xs whitespace-nowrap transition-colors first-of-type:rounded-l-lg last-of-type:rounded-r-lg hover:bg-[color-mix(in_srgb,var(--destructive-dot)_34%,var(--card))] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand motion-reduce:transition-none',
												selected && 'bg-destructive-dot text-card hover:bg-destructive-dot',
											)}
											style={{
												flex: `${soundWeight} 0 ${soundWeight * SHORTEST_SOUND_WIDTH_PX}px`,
											}}
											onClick={() => player.playSound(sound)}
											onPointerEnter={(event) => onScoreTooltipShow(event.currentTarget, [sound])}
											onPointerLeave={onScoreTooltipHide}
											onFocus={(event) => onScoreTooltipShow(event.currentTarget, [sound])}
											onBlur={onScoreTooltipHide}
										>
											{/*이어 듣는 동안 소리 길이만큼 왼쪽부터 채움*/}
											{selected && groupPlaying && !!sound.duration_ms && (
												<span
													aria-hidden
													className="absolute inset-y-0 left-0 w-0 animate-fill-width bg-foreground/24 motion-reduce:hidden"
													style={{ animationDuration: `${sound.duration_ms}ms` }}
												/>
											)}

											<strong className="relative font-semibold">
												{formatTimeWithSeconds(sound.captured_at)}
											</strong>
											{!!sound.duration_ms && (
												<span className="relative opacity-72 @max-[112px]:hidden">
													{formatAudioDuration(sound.duration_ms / SECOND)}
												</span>
											)}
										</button>
									);
								})}
							</fieldset>

							<div className="flex items-center gap-1.5 max-md:col-start-2 max-md:row-start-1">
								<Button
									variant="outline"
									size="icon-sm"
									aria-label={`${firstSoundTime} 응급 상황 소리 ${groupPlaying ? '정지' : '이어 듣기'}`}
									title={groupPlaying ? '정지' : '이어 듣기'}
									onClick={() => player.handleToggleSoundGroup(emergency)}
								>
									{groupPlaying ? (
										<Square className="size-3 fill-current" />
									) : (
										<Play className="size-3.5 fill-current" />
									)}
								</Button>

								<SessionSoundDownloadButton
									sounds={emergency.sounds}
									fileName={`emergency-${formatCompactDateTime(emergency.sounds[0].captured_at)}.wav`}
									label={`${firstSoundTime} 응급 상황 소리 다운로드`}
								/>
							</div>
						</li>
					);
				})}
			</ul>
		</section>
	);
};

export default SessionEmergencyList;
