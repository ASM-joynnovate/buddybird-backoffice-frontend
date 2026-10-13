'use client';

import Link from 'next/link';

import type { Emergency, EmergencySound } from '@/types/apis/emergencies';

import { cn } from '@/lib/utils';

import dayjs from 'dayjs';
import { ChevronRight } from 'lucide-react';

import EmergencyPetcam from '@/app/(main)/(backoffice)/emergencies/_components/emergency-petcam';
import EmergencySoundLane from '@/app/(main)/(backoffice)/emergencies/_components/emergency-sound-lane';
import { formatDuration, formatShortDateTime } from '@/utils/date';
import { toPeriodPercent } from '@/utils/session';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';

interface Props {
	emergency: Emergency;
	now: number;
	currentSoundId: string | null;
	soundPlaying: boolean;
	onToggleSounds: () => void;
	onPlaySound: (sound: EmergencySound) => void;
}

/**
 * 행 아래에 펼치는 응급 상황 상세 컴포넌트
 * @param emergency 표시할 응급 상황
 * @param now 현재 시각
 * @param currentSoundId 선택한 소리의 ID
 * @param soundPlaying 이 응급 상황의 소리를 재생 중인지 여부
 * @param onToggleSounds 첫 소리부터 재생하거나 정지하는 함수
 * @param onPlaySound 선택한 소리부터 재생하는 함수
 */
const EmergencyDetail = ({ emergency, now, currentSoundId, soundPlaying, onToggleSounds, onPlaySound }: Props) => {
	const { session, user, device, sound, vision } = emergency;

	const sessionPeriod = {
		startMs: dayjs(session.started_at).valueOf(),
		endMs: dayjs(session.ended_at ?? now).valueOf(),
	};

	return (
		<div className="@container rounded-lg bg-card-inset shadow-[inset_0_0_0_1px_var(--border)]">
			<div className="grid gap-4 p-4">
				{!!sound && (
					<EmergencySoundLane
						sounds={sound.sounds}
						chirpCount={sound.chirp_count}
						currentSoundId={currentSoundId}
						playing={soundPlaying}
						onTogglePlay={onToggleSounds}
						onPlaySound={onPlaySound}
					/>
				)}

				{!!vision && <EmergencyPetcam occurredAt={emergency.occurred_at} vision={vision} />}

				{/*세션 안의 위치, 기기, 세션으로 이동*/}
				<div className="grid items-center gap-x-6 gap-y-3 border-t pt-4 @min-[620px]:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto]">
					<div>
						<p className="mb-2 flex items-center justify-between gap-3 text-[13px] text-muted-foreground tabular-nums">
							<span>
								세션
								<b className="ml-1.5 font-semibold text-foreground">
									{formatShortDateTime(session.started_at)}
								</b>
							</span>

							{session.status === 'running' ? (
								<Badge variant="success">실행 중</Badge>
							) : (
								formatDuration(sessionPeriod.endMs - sessionPeriod.startMs)
							)}
						</p>

						<figure
							aria-label="세션 안에서 응급 상황이 발생한 위치"
							className="relative h-2 rounded-full bg-chart-1/22"
						>
							<span
								className="absolute -inset-y-0.75 w-1 -translate-x-1/2 rounded-full bg-destructive-dot ring-2 ring-card-inset"
								style={{
									left: `${toPeriodPercent(dayjs(emergency.occurred_at).valueOf(), sessionPeriod)}%`,
								}}
							/>
						</figure>
					</div>

					<div className="text-[13px] text-muted-foreground tabular-nums">
						<p>
							기기
							<b className="ml-1.5 font-semibold text-foreground">{device.model}</b>
						</p>
						<small className="text-[12.5px]">앱 {device.app_version}</small>
					</div>

					<Link
						href={{ pathname: `/users/${user.id}`, query: { session_id: session.id } }}
						className={cn(buttonVariants({ variant: 'outline' }), '@min-[620px]:justify-self-end')}
					>
						세션 보기
						<ChevronRight data-icon="inline-end" />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default EmergencyDetail;
