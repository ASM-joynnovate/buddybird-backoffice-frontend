'use client';

import type { EmergencySound } from '@/types/apis/emergencies';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';
import { Play, Square } from 'lucide-react';

import SoundDownloadButton from '@/app/(main)/(backoffice)/_components/sound-download-button';
import { SECOND } from '@/config/units';
import { formatAudioDuration } from '@/utils/audio';
import { formatCompactDateTime, formatShortDateTimeWithSeconds, formatTimeWithSeconds } from '@/utils/date';

import { Button } from '@/components/ui/button';

interface Props {
	sounds: EmergencySound[];
	chirpCount: number;
	currentSoundId: string | null;
	playing: boolean;
	onTogglePlay: () => void;
	onPlaySound: (sound: EmergencySound) => void;
}

/**
 * 응급 상황으로 감지된 소리를 막대로 나열한 컴포넌트
 * @param sounds 감지된 순서의 소리 목록
 * @param chirpCount 감지된 울음 수
 * @param currentSoundId 선택한 소리의 ID
 * @param playing 이 응급 상황의 소리를 재생 중인지 여부
 * @param onTogglePlay 첫 소리부터 재생하거나 정지하는 함수
 * @param onPlaySound 선택한 소리부터 재생하는 함수
 */
const EmergencySoundLane = ({ sounds, chirpCount, currentSoundId, playing, onTogglePlay, onPlaySound }: Props) => {
	// 선택한 소리가 없으면 첫 소리 표시
	const selectedSound = sounds.find((sound) => sound.id === currentSoundId) ?? sounds.at(0);
	const lastSound = sounds.at(-1);

	if (!selectedSound || !lastSound) {
		return null;
	}

	const firstSoundTime = formatShortDateTimeWithSeconds(sounds[0].captured_at);

	return (
		<section className="grid grid-cols-[36px_minmax(0,1fr)] items-center gap-x-3 gap-y-1.5">
			<Button
				variant="outline"
				size="icon"
				aria-label={`${firstSoundTime} 응급 상황 소리 ${playing ? '정지' : '재생'}`}
				className="rounded-full"
				onClick={onTogglePlay}
			>
				{playing ? <Square className="size-3 fill-current" /> : <Play className="size-3.5 fill-current" />}
			</Button>

			{/*폭은 소리 길이, 높이는 앵무새 소리 점수*/}
			<div className="flex h-14 items-end gap-0.5">
				{sounds.map((sound) => (
					<button
						key={sound.id}
						type="button"
						aria-label={`${formatShortDateTimeWithSeconds(sound.captured_at)} 소리 재생`}
						aria-pressed={sound.id === selectedSound.id}
						className="group flex h-full min-w-1 items-end overflow-hidden rounded-sm bg-chart-1/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand aria-pressed:shadow-[inset_0_0_0_1.5px_var(--foreground)]"
						style={{ flex: sound.duration_ms ?? 1 }}
						onClick={() => onPlaySound(sound)}
					>
						<span
							className={cn(
								'w-full rounded-sm bg-chart-1/70 transition-colors group-hover:bg-chart-1 motion-reduce:transition-none',
								sound.id === selectedSound.id && 'bg-chart-1',
							)}
							style={{ height: `${(sound.analysis?.score ?? 1) * 100}%` }}
						/>
					</button>
				))}
			</div>

			<p className="col-start-2 flex justify-between text-[11.5px] text-muted-foreground tabular-nums">
				<time dateTime={sounds[0].captured_at}>{formatTimeWithSeconds(sounds[0].captured_at)}</time>
				<span>{formatTimeWithSeconds(dayjs(lastSound.captured_at).add(lastSound.duration_ms ?? 0, 'ms'))}</span>
			</p>

			<div className="col-start-2 flex min-h-7 flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted-foreground tabular-nums">
				<time dateTime={selectedSound.captured_at} className="text-sm font-semibold text-foreground">
					{formatTimeWithSeconds(selectedSound.captured_at)}
				</time>

				{!!selectedSound.duration_ms && <span>{formatAudioDuration(selectedSound.duration_ms / SECOND)}</span>}

				{!!selectedSound.analysis && (
					<span>
						앵무새 소리
						<b className="ml-1 font-bold text-foreground">
							{Math.round(selectedSound.analysis.score * 100)}%
						</b>
					</span>
				)}

				<span className="ml-auto">
					울음
					<b className="ml-1 font-bold text-foreground">{chirpCount.toLocaleString('ko-KR')}회</b>
				</span>

				<SoundDownloadButton
					sounds={sounds}
					fileName={`emergency-${formatCompactDateTime(sounds[0].captured_at)}.wav`}
					label={`${firstSoundTime} 응급 상황 소리 다운로드`}
					iconOnly
				/>
			</div>
		</section>
	);
};

export default EmergencySoundLane;
