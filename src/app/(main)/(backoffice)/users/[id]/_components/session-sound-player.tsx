'use client';

import { useEffect, useEffectEvent, useRef, useState } from 'react';

import type { SessionSound } from '@/types/apis/sessions';

import type { AudioPlaylist } from '@/hooks/use-audio-playlist';

import { ListMusic, Siren, SkipBack, SkipForward } from 'lucide-react';

import ColorTag from '@/app/(main)/(backoffice)/_components/color-tag';
import PlayButton from '@/app/(main)/(backoffice)/_components/play-button';
import { formatAudioDuration } from '@/utils/audio';
import { formatShortDateTimeWithSeconds } from '@/utils/date';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
	currentSound: SessionSound | null;
	emergencySoundIds: ReadonlySet<string>;
	player: AudioPlaylist;
}

/**
 * 세션 소리 재생 컴포넌트
 * @param currentSound 재생할 차례인 소리
 * @param emergencySoundIds 응급 상황으로 감지된 소리 ID
 * @param player useAudioPlaylist 결과
 */
const SessionSoundPlayer = ({ currentSound, emergencySoundIds, player }: Props) => {
	const spaceKeyHandledRef = useRef(false);

	const [progressPercent, setProgressPercent] = useState(0);

	const { playing, playbackFailed, durationSeconds, continuousPlayEnabled, previousSound, nextSound, audioProps } =
		player;
	const soundTime = currentSound && formatShortDateTimeWithSeconds(currentSound.captured_at);

	/** 재생 중 매 프레임 진행 비율 갱신 */
	useEffect(() => {
		if (!playing) {
			return;
		}

		let frame = requestAnimationFrame(function updateProgress() {
			const audio = audioProps.ref.current;

			// 다음 소리를 기다리거나 불러오는 동안은 0
			if (audio) {
				setProgressPercent(
					Number.isFinite(audio.duration) && !audio.ended ? (audio.currentTime / audio.duration) * 100 : 0,
				);
			}

			frame = requestAnimationFrame(updateProgress);
		});

		return () => cancelAnimationFrame(frame);
	}, [playing, audioProps.ref]);

	const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
		const { target } = event;
		const textInputFocused =
			target instanceof HTMLInputElement ||
			target instanceof HTMLTextAreaElement ||
			target instanceof HTMLSelectElement ||
			(target instanceof HTMLElement && target.isContentEditable);
		const dialogFocused = target instanceof Element && !!target.closest('[role="dialog"], [role="alertdialog"]');

		spaceKeyHandledRef.current =
			event.code === 'Space' &&
			!event.ctrlKey &&
			!event.metaKey &&
			!event.altKey &&
			!textInputFocused &&
			!dialogFocused &&
			!!currentSound;

		if (!spaceKeyHandledRef.current) {
			return;
		}

		event.preventDefault();

		if (!event.repeat) {
			player.handleTogglePlay();
		}
	});

	/** 소리를 고른 뒤에는 스페이스바로 재생 및 정지 */
	useEffect(() => {
		// 포커스가 있는 버튼이 다시 눌리지 않게 막음
		const handleKeyUp = (event: KeyboardEvent) => {
			if (event.code === 'Space' && spaceKeyHandledRef.current) {
				event.preventDefault();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	return (
		<div className="flex min-h-14 items-center gap-2.5 rounded-lg bg-muted py-2.5 pr-2 pl-2.5">
			<audio preload="none" {...audioProps}>
				<track kind="captions" />
			</audio>

			<PlayButton
				label={soundTime ? `${soundTime} 소리` : '처음 소리'}
				playing={playing}
				progressPercent={progressPercent}
				onClick={player.handleTogglePlay}
			/>

			<div className="mr-auto min-w-0">
				<strong className="block font-semibold tabular-nums">{soundTime ?? '처음부터 듣기'}</strong>

				{/*소리 길이 및 태그*/}
				<div className="flex min-h-5 flex-wrap items-center gap-x-2 gap-y-0.5 text-[13px] text-muted-foreground">
					{/*좁은 화면에서는 한 줄로 줄임*/}
					{!currentSound && (
						<span>
							막대를 누르면 <span className="max-md:hidden">그 시각부터 </span>재생
						</span>
					)}

					{!!currentSound && playbackFailed && (
						<p role="alert" className="text-destructive">
							재생하지 못했습니다. 다시 눌러 주세요.
						</p>
					)}

					{!!currentSound && !playbackFailed && (
						<>
							{durationSeconds !== null && (
								<time className="tabular-nums">{formatAudioDuration(durationSeconds)}</time>
							)}
							{currentSound.is_mimic && <ColorTag color="var(--foreground)">모사 성공</ColorTag>}
							{emergencySoundIds.has(currentSound.id) && (
								<Badge variant="destructive" className="max-md:pr-1.5 dark:bg-destructive/10">
									<Siren data-icon="inline-start" />
									<span className="max-md:sr-only">응급 상황</span>
								</Badge>
							)}
						</>
					)}
				</div>
			</div>

			<div className="flex items-center gap-0.5">
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label="이전 소리"
					title="이전 소리"
					disabled={!previousSound}
					className="text-muted-foreground hover:bg-card"
					onClick={player.handlePlayPrevious}
				>
					<SkipBack />
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					aria-label="다음 소리"
					title="다음 소리"
					disabled={!nextSound}
					className="text-muted-foreground hover:bg-card"
					onClick={player.handlePlayNext}
				>
					<SkipForward />
				</Button>

				<Tooltip>
					<TooltipTrigger
						render=<Button variant="outline" size="icon-sm" />
						aria-label="이어 듣기"
						aria-pressed={continuousPlayEnabled}
						className="ml-1.5 aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-card"
						onClick={player.handleToggleContinuousPlay}
					>
						<ListMusic />
					</TooltipTrigger>
					<TooltipContent side="bottom" align="end" sideOffset={8}>
						이어 듣기
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
};

export default SessionSoundPlayer;
